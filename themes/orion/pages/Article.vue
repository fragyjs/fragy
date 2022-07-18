<template>
  <a-layout class="article">
    <a-side class="article-menu-wrapper" no-default>
      <ArticleMenu ref="menu" :menu="menu" />
    </a-side>
    <a-layout class="article-main">
      <a-content>
        <MarkVue
          v-if="articleContent && supportMarkVue"
          id="article"
          v-lazy-container="{ selector: 'img' }"
          class="article-content"
          :content="articleContent"
          :markedOptions="markedOptions"
        ></MarkVue>
        <div
          v-if="articleContent && !supportMarkVue"
          id="article"
          v-lazy-container="{ selector: 'img' }"
          class="article-content"
          v-html="renderedContent"
        ></div>
        <div v-if="!articleContent" class="article--no-content">
          <a-loading v-if="!loadFailed" />
          <div v-else class="article-failed">
            <Icon class="article-failed__icon" icon="ion:warning" />
            <span class="article-failed__text">{{ notFoundText }}</span>
            <a-button class="article-failed__button" type="primary" @click="fetchArticle"
              >Reload</a-button
            >
          </div>
        </div>
      </a-content>
    </a-layout>
    <a-drawer
      v-model="mobileMenuVisible"
      appendToBody
      drawerClass="article-menu--mobile"
      width="60%"
      lockTarget="html"
    >
      <ArticleMenu ref="menu" :menu="menu" />
    </a-drawer>
    <MenuSwitch @click="() => (mobileMenuVisible = !mobileMenuVisible)" />
  </a-layout>
</template>

<script>
import { Icon } from '@iconify/vue';
import { defineComponent } from 'vue';
import { marked } from 'marked';
import { getArticleMenu } from '../utils/article';
import Renderer from '../utils/renderer';
import Menu from '../components/article/Menu.vue';
import MenuSwitch from '../components/article/MenuSwitch.vue';

const DEFAULT_NOT_FOUND_TEXT = 'Oops, something was wrong';
const DEFAULT_RELOAD_TEXT = 'Reload';
const MIN_LOADING_TIME = 2 * 1000;

export default defineComponent({
  components: {
    ArticleMenu: Menu,
    MenuSwitch,
    Icon,
  },
  data() {
    return {
      menu: [],
      meta: null,
      articleContent: '',
      renderedContent: '',
      loading: false,
      loadFailed: false,
      lastFetchTime: 0,
      notFound: false,
      mobileMenuVisible: false,
      markedOptions: {
        renderer: Renderer,
        highlight: (code) => {
          return window.hljs?.highlightAuto(code).value;
        },
      },
    };
  },
  watch: {
    async fileName(newValue) {
      if (!newValue) {
        return;
      }
      this.meta = null;
      this.menu = [];
      this.articleContent = '';
      this.renderedContent = '';
      this.loading = true;
      this.loadFailed = false;
      await this.fetchArticle();
      this.setTitle();
      window.scrollTo({
        top: 0,
      });
    },
  },
  computed: {
    fileName() {
      let { article: fileName } = this.$route.params;
      if (!fileName) {
        return;
      }
      if (!fileName.endsWith('.md')) {
        fileName = `${fileName}.md`;
      }
      return fileName;
    },
    notFoundText() {
      return this.$theme.article?.notFoundText || DEFAULT_NOT_FOUND_TEXT;
    },
    reloadText() {
      return this.$theme.article?.reloadText || DEFAULT_RELOAD_TEXT;
    },
    supportMarkVue() {
      return !!this.$fragy.markVue?.enable;
    },
  },
  created() {
    this.fetchArticle();
  },
  methods: {
    async fetchArticle() {
      let res;
      try {
        this.loading = true;
        this.loadFailed = false;
        this.lastFetchTime = Date.now();
        res = await this.$http.get(
          `${this.$fragy.articles.feed}/${encodeURIComponent(this.fileName)}`,
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article content.', err);
        const diffTime = Date.now() - this.lastFetchTime;
        console.log(diffTime);
        if (diffTime < MIN_LOADING_TIME) {
          setTimeout(() => {
            this.loadFailed = true;
            this.loading = false;
          }, MIN_LOADING_TIME - diffTime);
          return;
        }
        this.loadFailed = true;
        this.loading = false;
        return;
      }
      this.loading = false;
      if (res.status !== 200 || !res.data) {
        if (res.status === 404) {
          this.notFound = true;
        } else {
          this.loadFailed = true;
        }
      }
      this.renderArticle(res.data);
    },
    renderArticle(article) {
      if (!article) {
        this.loadFailed = true;
        return;
      }
      const parsedArticle = this.$utils.parseArticle(article.trim());
      this.meta = parsedArticle.meta;
      this.articleContent = parsedArticle.content.trim();
      if (!this.supportMarkVue) {
        this.renderedContent = marked.parse(this.articleContent, this.markedOptions);
      }
      this.$nextTick(() => {
        this.menu = getArticleMenu('article');
      });
    },
    setTitle() {
      const template = this.$theme.article.title;
      document.title = template
        .replace('{articleTitle}', this.title)
        .replace('{siteTitle}', this.$fragy.title);
    },
  },
});
</script>

<style lang="less">
.article {
  &-menu-wrapper {
    position: fixed !important;
    bottom: 0;
    left: 0;
    width: 16.5rem;
    height: calc(100vh - var(--nav-height));
    box-shadow: 0.125rem 0 0.5rem rgba(0, 0, 0, 0.02);
    z-index: 10;
    border-right: 1px solid var(--menu-border);
  }
  &-main {
    padding-left: 16.5rem;
    box-sizing: border-box;
    width: 100%;
    z-index: 2;
  }
  &-content {
    max-width: 100rem;
    margin: 0 auto;
    padding: var(--nav-height) 9rem 5rem 7.5rem;
    box-sizing: border-box;
    h1,
    h2,
    h3,
    h4,
    h5 {
      a {
        float: left;
        margin-left: -0.925em;
        margin-top: 0.115em;
        opacity: 0;
        text-decoration: none;
        transition: opacity 100ms ease;
        color: var(--primary);
      }
      a:hover {
        opacity: 1;
      }
    }
    h1:hover,
    h2:hover,
    h3:hover,
    h4:hover,
    h5:hover {
      a {
        opacity: 0.8;
      }
    }
    h1 {
      margin-top: 0;
      margin-bottom: 2.5rem;
      font-weight: 700;
      font-family: var(--main-font);
      color: var(--text-primary);
      letter-spacing: 0.05rem;
      text-decoration: none;
    }
    h2 {
      margin: 4rem 0 1.75rem;
      border-top: 1px solid var(--divider);
      padding-top: 2rem;
      font-size: 1.5rem;
      letter-spacing: 0.0375rem;
      color: var(--text-primary);
      text-decoration: none;
    }
    h3 {
      margin: 3.25rem 0 1.75rem;
      font-size: 1.25rem;
      letter-spacing: 0.0375rem;
      color: var(--text-primary);
      text-decoration: none;
    }
    h4,
    h5 {
      margin: 2.75rem 0 1.5rem;
      color: var(--text-primary);
      text-decoration: none;
    }
    p {
      margin: 0 0 1.25rem 0;
      color: var(--text-primary);
      line-height: 2rem;
      code {
        background: var(--tag-background);
        color: var(--text-secondary);
        padding: 0.1rem 0.375rem;
        border-radius: 0.25rem;
        margin: 0 0.125rem;
        box-sizing: border-box;
      }
      a {
        color: var(--primary);
        text-decoration: none;
        transition: opacity 100ms ease;
      }
      a:hover {
        opacity: 0.8;
      }
    }
    pre {
      margin: 0 0 1.5rem 0;
      overflow-x: auto;
      padding: 1.5rem 1.875rem;
      border-radius: 1rem;
      background: var(--code-background);
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5rem;
    }
    blockquote {
      margin: 1rem 0 2rem 0;
      border-left: 0.175rem solid var(--blockquote-text);
      padding-left: 1.2rem;
      p {
        color: var(--blockquote-text);
        line-height: 1.875rem;
        margin-bottom: 0;
      }
      & > blockquote {
        border-left: 0.175rem solid var(--blockquote-text);
        padding-left: 1rem;
        color: var(--blockquote-text);
        margin-top: 0.5rem;
        p {
          color: var(--blockquote-text);
        }
      }
    }
    li {
      line-height: 2.5rem;
      color: var(--text-primary);
      code {
        background: var(--tag-background);
        color: var(--text-secondary);
        padding: 0.1rem 0.375rem;
        border-radius: 0.25rem;
        margin: 0 0.125rem;
        box-sizing: border-box;
      }
    }
  }
}

@media screen and (max-width: 1024px) {
  .article {
    &-menu-wrapper {
      width: 14rem;
    }
    &-main {
      padding-left: 14rem;
    }
    &-content {
      padding: 2.5rem 3.25rem;
    }
  }
}

@media screen and (max-width: 960px) {
  .article {
    &-menu-wrapper {
      width: 13.75rem;
    }
    &-main {
      padding-left: 13.75rem;
    }
    &-content {
      padding: 2rem 2.75rem;
    }
  }
}

@media screen and (max-width: 768px) {
  .article {
    &-menu-wrapper {
      display: none;
    }
    &-main {
      padding-left: 0;
    }
    &-content {
      padding: 1.75rem 2rem;
      h1 {
        font-size: 1.5rem;
      }
      h2 {
        font-size: 1.375rem;
        margin: 2rem 0 1.625rem;
      }
      h3 {
        font-size: 1.2rem;
      }
      h4,
      h5 {
        font-size: 1.125rem;
      }
      ol {
        padding-inline-start: 1.75rem;
      }
      pre {
        padding: 1rem 1.375rem;
      }
    }
  }
  .article-menu--mobile {
    .a-drawer__mask {
      background-color: rgba(0, 0, 0, 0.7);
    }
    .a-drawer__body {
      background-color: var(--page-background);
      .article-menu::-webkit-scrollbar {
        width: 0.375rem;
      }
    }
  }
}

.article--no-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--nav-height));
  .a-loading-wrapper {
    transform: translateY(-100%);
    .a-loading {
      font-size: 0.75rem;
    }
  }
  .article-failed {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform: translateY(-50%);
    user-select: none;
    &__text {
      font-size: 1.5rem;
      color: var(--primary);
      line-height: 4.5rem;
    }
    &__icon {
      font-size: 4.5rem;
      color: var(--primary);
    }
    &__button {
      margin-top: 0.75rem;
    }
  }
}
</style>
