<template>
  <div v-if="showEmpty" class="article-list article-list-empty">
    <span v-if="listDataLoading">{{ $t('article_list_loading') }}</span>
    <span v-if="loadFailed">{{ $t('article_list_load_failed') }}</span>
    <span v-if="showDefaultEmptyText">{{ $t('article_list_empty') }}</span>
  </div>
  <div v-else class="article-list">
    <div class="article-list__main">
      <ArticleBlock
        v-for="item in currentArticles"
        :key="item.title"
        :title="item.title"
        :abstract="item.abstract"
        :date="item.date"
        :fileName="item.fileName"
        :metaLoadFailed="item.metaLoadFailed"
      />
    </div>
    <div class="article-list__footer">
      <Paginator
        v-if="pageCount > 1"
        :currentPage="currentPage"
        :pageCount="pageCount"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import { getFromCache, setToCache } from '../../utils/cache';
import ArticleBlock from './ArticleBlock';
import Paginator from '../layout/Paginator';
import githubMixin from '../../mixin/github';

const GITHUB_FILES_CACHE_KEY = 'fragy-github-files';

const A_HOUR_IN_MS = 60 * 60 * 1000;
const TEN_MIN_IN_MS = 10 * 60 * 1000;

export default defineComponent({
  name: 'fragy.purity.articles.list',
  components: {
    ArticleBlock,
    Paginator,
  },
  mixins: [githubMixin],
  data() {
    const currentPage = parseInt(this.$route.query?.page, 10) || 1;
    return {
      currentPage,
      total: 0,
      pageInited: false,
      pageSize: this.$fragy.articleList?.pageSize || 10,
      articles: null,
      listDataLoading: false,
      loadFailed: false,
      lastFetchTime: null,
      loadedPages: {},
      metaMap: {},
    };
  },
  async created() {
    try {
      // get from cache first
      this.articles = (await getFromCache('articles')) || null;
      // request remote
      this.fetchArticlesList();
    } catch (err) {
      console.error(err);
    } finally {
      // set page inited
      setTimeout(() => {
        this.pageInited = true;
      });
    }
  },
  computed: {
    ...mapGetters('article', ['cacheExisted', 'getCachedContent']),
    showEmpty() {
      return this.listDataLoading || this.loadFailed || this.showDefaultEmptyText;
    },
    showDefaultEmptyText() {
      return !this.listDataLoading && !this.loadFailed && !this.currentArticles && this.pageInited;
    },
    currentArticles() {
      if (!this.articles) {
        return null;
      }
      if (this.$fragy.articleList.splitPage) {
        return this.articles[this.currentPage];
      } else {
        const start = (this.currentPage - 1) * 10;
        const end = this.currentPage * 10;
        return this.articles.slice(start, end);
      }
    },
    pageCount() {
      if (this.$fragy.articleList.splitPage) {
        return Math.floor(this.total / this.pageSize) + 1;
      } else {
        return Math.floor(this.articles.length / this.pageSize) + 1;
      }
    },
  },
  methods: {
    ...mapMutations('article', ['setCache']),
    getFeed(page) {
      return this.$fragy.articleList.splitPage
        ? `${this.$fragy.articleList.feed}/page-${page}.json`
        : this.$fragy.articleList.feed;
    },
    async fetchGithubFiles() {
      // reset flags
      if (!this.articles?.[this.currentPage]) {
        this.listDataLoading = true;
        this.loadFailed = false;
      }
      // list data var
      let listData;
      // check cached content
      const stored = window.localStorage.getItem(GITHUB_FILES_CACHE_KEY);
      const cacheTime = this.$fragy.github.proxy ? A_HOUR_IN_MS : TEN_MIN_IN_MS;
      const cacheCheckPassed = stored && Date.now() - stored.time <= cacheTime;
      if (cacheCheckPassed) {
        listData = stored.data;
      } else {
        // no cache
        let res;
        try {
          res = await this.$http.get(this.getGithubListUrl());
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch github files.', err);
          this.listDataLoading = false;
          this.loadFailed = true;
          return;
        }
        if (!res.data || !Array.isArray(res.data)) {
          if (!this.articles?.[this.currentPage]) {
            this.listDataLoading = false;
            this.loadFailed = true;
          }
          return;
        }
        listData = res.data;
      }
      // set cache
      if (!cacheCheckPassed) {
        window.localStorage.setItem(GITHUB_FILES_CACHE_KEY, {
          data: listData,
          time: Date.now(),
        });
      }
      // get list
      const articles = listData
        .map((item) => {
          if (!item.name.endsWith('.md')) {
            return null;
          }
          return {
            fileName: item.name,
            title: item.name.replace('.md', ''),
            contentUrl: item.download_url,
          };
        })
        .filter((item) => !!item);
      // check if page is invalid
      if (this.currentPage * this.pageSize > articles.length) {
        this.currentPage = 1;
        if (this.currentPage > 1 && this.$router.query.page) {
          this.$router.replace({
            query: null,
          });
        }
      }
      // if articles list is too long, fetch first page first
      const listOverOnePage = articles.length > this.pageSize;
      const firstBatch = listOverOnePage
        ? articles.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize - 1,
          )
        : articles;
      // prefetch all url content
      const metaMap = await this.fetchGithubContent(firstBatch);
      this.articles = articles.map((article) => {
        if (metaMap[article.fileName]) {
          return {
            ...article,
            ...metaMap[article.fileName],
          };
        }
        return {
          ...article,
          metaLoadFailed: true,
        };
      });
      Object.assign(this.metaMap, metaMap);
      this.total = this.articles.length;
      this.listDataLoading = false;
      if (listOverOnePage) {
        this.prefetchGithubContents();
      }
    },
    prefetchGithubContents() {
      const startIdx = (this.currentPage + 1) * this.pageSize;
      let endIdx = (this.currentPage + 2) * this.pageSize - 1;
      if (endIdx > this.articles.length - 1) {
        endIdx = this.articles.length - 1;
      }
      this.batchFetchGithubContent(this.articles.slice(startIdx, endIdx));
    },
    batchFetchGithubContent(articles) {
      // parallel request
      articles.forEach(async (item) => {
        const fileName = decodeURIComponent(
          item.contentUrl.substr(item.contentUrl.lastIndexOf('/') + 1),
        );
        // check cache
        if (this.cacheExisted(fileName)) {
          return this.getCachedContent(fileName);
        }
        // no cache
        const res = await this.$http.get(this.getGithubContentUrl(item.contentUrl));
        if (res.status !== 200 || !res.data) {
          return;
        }
        const content = {
          ...this.$utils.parseArticle(res.data),
          fileName,
        };
        this.setCache({
          fileName,
          article: content,
        });
        // set to list
        for (let i = 0; i < articles.length; i++) {
          const article = this.articles[i];
          if (article.fileName === fileName) {
            this.articles[i] = {
              ...article,
              ...content.meta,
            };
            break;
          }
        }
      });
    },
    async fetchGithubContent(articles) {
      /* use Promise.allSettled to enhance user experience on the first page */
      const contents = (
        await Promise.allSettled(
          articles.map((article) => {
            const fileName = decodeURIComponent(
              article.contentUrl.substr(article.contentUrl.lastIndexOf('/') + 1),
            );
            if (this.cacheExisted(fileName)) {
              return Promise.resolve({
                parsed: true,
                data: this.getCachedContent(fileName),
              });
            }
            return this.$http.get(this.getGithubContentUrl(article.contentUrl));
          }),
        )
      )
        .map((item, index) => {
          if (item.status !== 'fulfilled') {
            return {
              ...articles[index],
              metaLoadFailed: true,
            };
          }
          const contentRes = item.value;
          if (contentRes.parsed) {
            return contentRes.data;
          }
          if (contentRes.status !== 200 || !contentRes.data) {
            return {
              ...articles[index],
              metaLoadFailed: true,
            };
          }
          // get fileName from url
          const reqUrl = contentRes.config.url;
          const fileName = decodeURIComponent(reqUrl.substr(reqUrl.lastIndexOf('/') + 1));
          return {
            ...this.$utils.parseArticle(contentRes.data),
            fileName,
          };
        })
        .filter((item) => {
          const notNull = !!item;
          if (notNull && !item.metaLoadFailed) {
            this.setCache({
              fileName: item.fileName,
              article: item,
            });
          }
          return notNull;
        });
      const metaMap = {};
      contents.forEach((article) => {
        metaMap[article.fileName] = {
          ...article.meta,
          abstract: article.abstract || '',
        };
      });
      return metaMap;
    },
    async fetchArticlesList() {
      if (this.$fragy.github) {
        return this.fetchGithubFiles();
      }
      if (this.loadedPages[this.currentPage]) {
        this.$nextTick(() => {
          if (this.$theme.article.prefetch) {
            this.prefetchAricles();
          }
          if (this.$fragy.articleList.splitPage && this.$theme.articleList.prefetch) {
            this.prefetchArticleList();
          }
        });
        return;
      }
      // reset flags
      if (!this.articles?.[this.currentPage]) {
        this.listDataLoading = true;
        this.loadFailed = false;
      }
      // send request
      let res;
      try {
        res = await this.$http.get(this.getFeed(this.currentPage));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article list info.', err);
        if (!this.articles?.[this.currentPage]) {
          this.listDataLoading = false;
          this.loadFailed = true;
        }
        return;
      }
      this.listDataLoading = false;
      if (res.data.total) {
        this.total = res.data.total;
      }
      this.loadedPages[this.currentPage] = true;
      if (this.$fragy.articleList.splitPage) {
        if (!this.articles) this.articles = {};
        this.articles[this.currentPage] = res.data.listData;
      } else {
        this.articles = res.data.listData;
      }
      this.lastFetchTime = Date.now();
      setToCache('articles', this.articles);
      // start prefetch for better experience
      if (this.$theme.article.prefetch) {
        this.$nextTick(() => {
          this.prefetchAricles();
        });
      }
      if (this.$fragy.articleList.splitPage && this.$theme.articleList.prefetch) {
        this.$nextTick(() => {
          this.prefetchArticleList();
        });
      }
    },
    async prefetchArticleList() {
      if (this.currentPage === this.pageCount) {
        return;
      }
      const needFetch = [];
      if (this.currentPage === 1) {
        needFetch.push(2);
      } else {
        needFetch.push(this.currentPage - 1);
        needFetch.push(this.currentPage + 1);
      }
      needFetch.forEach(async (page) => {
        // check existed cache
        if (this.loadedPages[page]) {
          return;
        }
        // fetch info
        let res;
        try {
          res = await this.$http.get(this.getFeed(page));
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to pre-fetch article list info.', err);
          return;
        }
        this.articles[page] = res.data.listData;
        this.loadedPages[page] = true;
      });
      // update persist cache
      setToCache('articles', this.articles);
    },
    onPageChange(page) {
      this.currentPage = page;
      if (this.$route.query?.page !== page) {
        if (page !== 1) {
          this.$router.replace({
            query: {
              page,
            },
          });
        } else {
          this.$router.replace({
            query: null,
          });
        }
      }
      if (this.$fragy.articleList.splitPage) {
        this.fetchArticlesList();
      } else if (this.$theme.article.prefetch) {
        this.$nextTick(() => {
          this.prefetchAricles();
        });
      }
    },
    prefetchAricles() {
      if (!this.currentArticles) {
        return;
      }
      this.currentArticles.forEach(async (article) => {
        if (this.cacheExisted(article.fileName)) {
          return;
        }
        const res = await this.$http.get(`${this.$fragy.articles.feed}/${article.fileName}`);
        const parsedArticle = this.$utils.parseArticle(res.data.trim());
        // set to temp cache
        this.setCache({
          fileName: article.fileName,
          article: parsedArticle,
        });
      });
    },
  },
});
</script>

<style lang="less">
.article-list-empty {
  user-select: none;
  span {
    color: var(--article-block-text);
  }
}
</style>
