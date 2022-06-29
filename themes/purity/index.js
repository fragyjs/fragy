import VueLazyload from 'vue-lazyload';
import axios from 'axios';
import Index from './pages/index.vue';
import Article from './pages/article.vue';
import NotFound from './pages/notFound.vue';
import { getMessage } from './utils/i18n';
import store from './store';
import './utils/extend';
import './styles/layout.less';

export default {
  name: 'purity',
  setup(app) {
    app.use(VueLazyload, {
      observer: true,
    });
    app.config.globalProperties.$t = getMessage;
    app.config.globalProperties.$http = axios;
  },
  store,
  routes: [
    {
      path: '/',
      component: Index,
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/article/:name',
      component: Article,
    },
    {
      path: '/notFound',
      component: NotFound,
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/notFound',
    },
  ],
};
