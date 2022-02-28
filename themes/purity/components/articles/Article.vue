<template>
  <div class="article">
    <div class="article-header">
      <div id="article-title" class="article-header-title">
        <span>{{ title }}</span>
      </div>
      <div v-if="showMeta" class="article-header-meta">
        <div v-if="showDate" class="article-header-meta__item">
          <Date /><span>{{ meta.date }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="showContent && !supportMarkVue"
      id="article-content"
      v-lazy-container="{ selector: 'img' }"
      :class="{
        'article-content': true,
        'text-justify': $theme.article.useJustifyAlign,
      }"
      v-html="renderedContent"
    ></div>
    <MarkVue
      v-if="showContent && supportMarkVue"
      id="article-content"
      v-lazy-container="{ selector: 'img' }"
      :content="content"
      :class="{
        'article-content': true,
        'text-justify': $theme.article.useJustifyAlign,
      }"
    />
    <div v-if="contentLoading" class="article-content article-content-loading">
      <span>
        {{ $t('article_loading') }}
      </span>
      <i><Loading /></i>
    </div>
    <div v-if="loadFailed" class="article-content article-content-failed">
      <p>{{ $t('article_load_failed') }}</p>
    </div>
    <div v-if="showValine" class="article-comment">
      <div id="vcomments"></div>
    </div>
  </div>
</template>

<script>
import pangu from 'pangu.simple';
import { defineComponent } from 'vue';
import { mapGetters, mapMutations, mapState } from 'vuex';
import Date from '../icons/Date';
import Loading from '../icons/Loading';
import githubMixin from '../../mixin/github';
import { optimizeExternalLink } from '../../utils/renderer';

export default defineComponent({
  name: 'fragy.purity.article',
  props: {
    article: String,
  },
  components: {
    Date,
    Loading,
  },
  mixins: [githubMixin],
  data() {
    return {
      meta: null,
      content: '',
      contentLoading: true,
      renderedContent: '',
      loadFailed: false,
      showValine: this.$theme.valine.enable,
      valine: null,
    };
  },
  watch: {
    async filename(newValue) {
      if (!newValue) {
        return;
      }
      this.meta = null;
      this.content = '';
      this.contentLoading = true;
      this.loadFailed = false;
      this.renderedContent = '';
      await this.fetchArticle();
      this.setTitle();
      window.scrollTo({
        top: 0,
      });
    },
  },
  async mounted() {
    await this.fetchArticle();
    this.setTitle();
    // scroll to top
    window.scrollTo({
      top: 0,
    });
    // mount valine
    if (this.showValine) {
      const valineConfig = { ...this.$theme.valine };
      delete valineConfig.enable;
      const valine = new window.Valine({
        el: '#vcomments',
        ...valineConfig,
      });
      this.valine = valine;
    }
  },
  computed: {
    ...mapState({
      storedTitle: (state) => state.article.title,
    }),
    ...mapGetters('article', ['getCachedContent', 'cacheExisted']),
    title() {
      let title;
      if (this.storedTitle) {
        title = this.storedTitle;
      } else if (this.meta?.title) {
        title = this.meta.title;
      } else {
        title = this.$route.params.name;
        if (title.endsWith('.md')) {
          title = title.substr(0, title.length - 3);
        }
      }
      return pangu.spacing(title);
    },
    filename() {
      if (!this.$route.path.includes('article')) {
        return '';
      }
      let filename = this.$route.params.name;
      if (!filename.endsWith('.md')) {
        filename = `${filename}.md`;
      }
      return filename;
    },
    showMeta() {
      return !!this.meta;
    },
    showDate() {
      return !!this.meta?.date;
    },
    showContent() {
      return !this.contentLoading && !this.loadFailed;
    },
    supportMarkVue() {
      return !!this.$fragy.markVue?.enabled;
    },
  },
  methods: {
    ...mapMutations('article', ['setCache']),
    async fetchArticle() {
      // check cache
      if (this.cacheExisted(this.filename)) {
        this.afterParsed(this.getCachedContent(this.filename));
        return;
      }
      // if using github mode, fetch content from github
      if (this.$fragy.github) {
        this.fetchContentFromGithub();
        return;
      }
      // no cache
      let res;
      try {
        res = await this.$http.get(
          `${this.$fragy.articles.feed}/${encodeURIComponent(this.filename)}`,
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article content.', err);
        this.contentLoading = false;
        this.loadFailed = true;
        return;
      }
      this.afterLoaded(res);
    },
    async fetchContentFromGithub() {
      let res;
      try {
        res = await this.$http.get(this.getGithubRawContentUrl(this.filename));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article content.', err);
        this.contentLoading = false;
        this.loadFailed = true;
        return;
      }
      this.afterLoaded(res);
    },
    afterLoaded(contentRes) {
      if (contentRes.status !== 200 || !contentRes.data) {
        this.contentLoading = false;
        this.loadFailed = true;
        return;
      }
      const parsedArticle = this.$utils.parseArticle(contentRes.data.trim());
      this.setCache({
        filename: this.filename,
        article: parsedArticle,
      });
      this.afterParsed(parsedArticle);
    },
    afterParsed(parsedArticle) {
      this.meta = parsedArticle.meta;
      this.content = parsedArticle.content.trim();
      this.contentLoading = false;
      this.renderContent();
    },
    renderContent() {
      if (!this.supportMarkVue) {
        this.renderedContent = window.marked.parse(this.content);
      }
      this.$nextTick(() => {
        pangu.spacingElementById('article-title');
        pangu.spacingElementById('article-content');
        optimizeExternalLink(document.querySelector('#article-content'));
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
  &-header {
    border-bottom: 0.0625rem dashed var(--article-border);
    padding-bottom: 1.5rem;
    &-title {
      font-size: 1.5rem;
      font-weight: 700;
      text-align: justify;
      color: var(--article-title);
      letter-spacing: 0.0875rem;
    }
    &-meta {
      margin-top: 1rem;
      &__item {
        display: flex;
        svg {
          width: 1.125rem;
          height: 1.125rem;
          margin-right: 0.5rem;
          fill: var(--article-meta);
        }
        span {
          color: var(--article-meta);
          font-size: 0.875rem;
        }
      }
    }
  }
  &-content {
    padding: 1.5rem 0;
    border-bottom: 0.0625rem dashed var(--article-border);
    line-height: 2;
    color: var(--article-text);
    p {
      color: var(--article-text);
      margin: 0 0 1rem 0;
      line-height: 2rem;
      font-weight: 400;
      letter-spacing: 0.05rem;
      code {
        padding: 0.25rem 0.45rem;
        background: var(--article-code-bg);
        font-size: 0.875rem;
      }
    }
    p:last-child {
      margin-bottom: 0;
    }
    a {
      color: var(--article-text);
    }
    a:hover {
      color: var(--article-link-hover) !important;
    }
    a:visited {
      color: var(--article-text);
    }
    h1,
    h2,
    h3,
    h4,
    h5 {
      color: var(--article-title);
      border-bottom: 0.0625rem solid var(--article-title-border);
      letter-spacing: 0.075rem;
      padding-bottom: 0.5rem;
    }
    h1:first-child,
    h2:first-child,
    h3:first-child,
    h4:first-child,
    h5:first-child {
      margin-top: 0;
    }
    h1 {
      font-size: 1.375rem;
    }
    h2 {
      font-size: 1.25rem;
    }
    h2::before {
      content: '#';
      color: var(--primary);
      opacity: 0.4;
      margin-right: 0.5rem;
      font-size: 1.125rem;
    }
    h3 {
      font-size: 1.15rem;
    }
    h3::before {
      content: '##';
      color: var(--primary);
      opacity: 0.4;
      margin-right: 0.5rem;
      font-size: 1rem;
    }
    h4 {
      font-size: 1.115rem;
    }
    h4::before {
      content: '###';
      color: var(--primary);
      opacity: 0.4;
      margin-right: 0.5rem;
      font-size: 1rem;
    }
    h5 {
      font-size: 1.025rem;
    }
    h5::before {
      content: '####';
      color: var(--primary);
      opacity: 0.4;
      margin-right: 0.5rem;
      font-size: 0.9rem;
    }
    img {
      display: block;
      max-width: 100%;
      margin: 1rem auto;
    }
    pre {
      width: 100%;
      background: var(--article-code-bg);
      padding: 0.625rem 1rem;
      box-sizing: border-box;
      overflow-x: auto;
      box-shadow: 2px 2px 8px var(--article-code-shadow);
      code {
        color: var(--article-code-text);
      }
    }
    ul {
      color: var(--article-text);
    }
    hr {
      margin: 1.25rem 0;
      height: 1px;
      background-color: transparent;
      border-top: none;
      border-left: none;
      border-right: none;
      border-bottom: 1px dashed var(--article-title-border);
    }
  }
  &-content-loading {
    display: flex;
    align-items: center;
    span {
      color: var(--article-text);
    }
    i {
      display: flex;
      align-items: center;
      svg {
        width: 1.25rem;
        height: 1.25rem;
        fill: var(--primary);
        transform: translateY(-0.125rem);
        margin-left: 0.625rem;
        animation: rotate 1.125s ease-in-out infinite;
      }
    }
  }
  &-comment {
    padding-top: 2.5rem;
  }
}

.dark {
  .article {
    img {
      filter: brightness(0.875);
    }
  }
}
</style>
