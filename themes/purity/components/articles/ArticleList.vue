<template>
  <div class="article-list article-list-empty" v-if="showEmpty">
    <span v-if="listDataLoading">{{ $t('article_list_loading') }}</span>
    <span v-if="loadFailed">{{ $t('article_list_load_failed') }}</span>
    <span v-if="showDefaultEmptyText">{{ $t('aritcle_list_empty') }}</span>
  </div>
  <div class="article-list" v-else>
    <div class="article-list__main">
      <ArticleBlock
        v-for="item in currentArticles"
        :key="item.title"
        :title="item.title"
        :abstract="item.abstract"
        :date="item.date"
        :filename="item.filename"
        :metaLoadFailed="item.metaLoadFailed"
      />
    </div>
    <div class="article-list__footer">
      <Paginator
        :currentPage="currentPage"
        :pageCount="pageCount"
        @change="onPageChange"
        v-if="pageCount > 1"
      />
    </div>
  </div>
</template>

<script>
import ArticleBlock from './ArticleBlock';
import Paginator from '../layout/Paginator';
import { mapGetters, mapMutations } from 'vuex';

const GITHUB_FILES_CACHE_KEY = 'fragy-github-files';

const A_HOUR_IN_MS = 60 * 60 * 1000;
const TEN_MIN_IN_MS = 10 * 60 * 1000;

export default {
  name: 'fragy.purity.articles.list',
  components: {
    ArticleBlock,
    Paginator,
  },
  data() {
    const currentPage = parseInt(this.$route.query?.page, 10) || 1;
    return {
      currentPage,
      total: 0,
      pageSize: this.$fragy.articleList?.pageSize || 10,
      articles: null,
      listDataLoading: true,
      loadFailed: false,
      lastFetchTime: null,
      loadedPages: {},
      metaMap: {},
    };
  },
  created() {
    this.fetchArticlesList();
  },
  computed: {
    ...mapGetters('article', ['cacheExisted']),
    showEmpty() {
      return this.listDataLoading || this.loadFailed || this.showDefaultEmptyText;
    },
    showDefaultEmptyText() {
      return !this.listDataLoading && !this.loadFailed && !this.currentArticles;
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
    getGithubListUrl() {
      if (this.$fragy.github) {
        const { repo, proxy, base } = this.$fragy.github;
        const apiUrl = this.$consts.GITHUB_CONTENTS_API.replace('{repo}', repo).replace(
          '{base}',
          base || '.fragy/posts',
        );
        if (proxy) {
          let formattedProxy = proxy;
          if (proxy.endsWith('/')) {
            formattedProxy = `${proxy}/`;
          }
          return `${formattedProxy}${apiUrl}`;
        }
        return apiUrl;
      }
    },
    getGithubContentUrl(contentUrl) {
      const { proxy } = this.$fragy.github;
      if (proxy) {
        const formattedProxy = proxy.endsWith('/') ? proxy : `${proxy}/`;
        return `${formattedProxy}${contentUrl}`;
      }
      return contentUrl;
    },
    getFeed(page) {
      return this.$fragy.articleList.splitPage
        ? `${this.$fragy.articleList.feed}/page-${page}.json`
        : this.$fragy.articleList.feed;
    },
    async fetchGithubFiles() {
      // reset flags
      this.listDataLoading = true;
      this.loadFailed = false;
      // check cached content
      const stored = window.localStorage.getItem(GITHUB_FILES_CACHE_KEY);
      const cacheTime = this.$fragy.github.proxy ? A_HOUR_IN_MS : TEN_MIN_IN_MS;
      if (stored && Date.now() - stored.time <= cacheTime) {
        return stored;
      }
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
      if (!Array.isArray(res.data)) {
        this.listDataLoading = false;
        this.loadFailed = true;
        return;
      }
      // get list
      const articles = res.data
        .map((item) => {
          if (!item.name.endsWith('.md')) {
            return null;
          }
          return {
            filename: item.name,
            title: item.name.replace('.md', ''),
            contentUrl: item.download_url,
          };
        })
        .filter((item) => !!item);
      // if articles list is too long, fetch first page first
      const listOverOnePage = articles.length > this.pageSize;
      const firstBatch = listOverOnePage ? articles.slice(0, this.pageSize - 1) : articles;
      // prefetch all url content
      const metaMap = await this.fetchGithubContent(firstBatch);
      this.articles = articles.map((article) => {
        if (metaMap[article.filename]) {
          return {
            ...article,
            ...metaMap[article.filename],
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
        this.batchFetchGithubContent(articles.slice(this.pageSize));
      }
    },
    batchFetchGithubContent(articles) {
      // parallel request
      articles.forEach(async (item) => {
        const res = await this.$http.get(this.getGithubContentUrl(item.contentUrl));
        if (res.status !== 200 || !res.data) {
          return;
        }
        const reqUrl = res.config.url;
        const filename = decodeURIComponent(reqUrl.substr(reqUrl.lastIndexOf('/') + 1));
        const content = {
          ...this.$utils.parseArticle(res.data),
          filename,
        };
        this.setCache({
          filename,
          article: content,
        });
        // set to list
        for (let i = 0; i < articles.length; i++) {
          const article = this.articles[i];
          if (article.filename === filename) {
            this.$set(this.articles, i, {
              ...article,
              ...content.meta,
            });
            break;
          }
        }
      });
    },
    async fetchGithubContent(articles) {
      const contents = (
        await Promise.allSettled(
          articles.map((article) => {
            return this.$http.get(this.getGithubContentUrl(article.contentUrl));
          }),
        )
      )
        .map((item) => {
          if (item.status !== 'fulfilled') {
            return null;
          }
          const contentRes = item.value;
          if (contentRes.status !== 200 || !contentRes.data) {
            return null;
          }
          // get filename from url
          const reqUrl = contentRes.config.url;
          const filename = decodeURIComponent(reqUrl.substr(reqUrl.lastIndexOf('/') + 1));
          return {
            ...this.$utils.parseArticle(contentRes.data),
            filename,
          };
        })
        .filter((item) => {
          const notNull = !!item;
          if (notNull) {
            this.setCache({
              filename: item.filename,
              article: item,
            });
          }
          return notNull;
        });
      const metaMap = {};
      contents.forEach((article) => {
        metaMap[article.filename] = {
          ...article.meta,
          abstract: article.abstract,
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
      this.listDataLoading = true;
      this.loadFailed = false;
      // send request
      let res;
      try {
        res = await this.$http.get(this.getFeed(this.currentPage));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article list info.', err);
        this.listDataLoading = false;
        this.loadFailed = true;
        return;
      }
      this.listDataLoading = false;
      if (res.data.total) {
        this.total = res.data.total;
      }
      this.loadedPages[this.currentPage] = true;
      if (this.$fragy.articleList.splitPage) {
        if (!this.articles) this.articles = {};
        this.$set(this.articles, this.currentPage, res.data.listData);
      } else {
        this.articles = res.data.listData;
      }
      this.lastFetchTime = Date.now();
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
        this.$set(this.articles, page, res.data.listData);
        this.loadedPages[page] = true;
      });
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
        if (this.cacheExisted(article.filename)) {
          return;
        }
        const res = await this.$http.get(`${this.$fragy.articles.feed}/${article.filename}`);
        const parsedArticle = this.$utils.parseArticle(res.data.trim());
        this.setCache({
          filename: article.filename,
          article: parsedArticle,
        });
      });
    },
  },
};
</script>

<style lang="less">
.article-list-empty {
  user-select: none;
  span {
    color: var(--article-block-text);
  }
}
</style>
