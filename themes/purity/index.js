import VueLazyload from 'vue-lazyload';
import store from './store';
import Index from './pages/index.vue';
import Article from './pages/article.vue';
import NotFound from './pages/notFound.vue';
import { getMessage } from './utils/i18n';
import './utils/extend';
import './styles/layout.less';

export default {
  name: 'purity',
  setup(Vue) {
    Vue.use(VueLazyload, {
      observer: true,
    });
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$t = getMessage;
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
      path: '*',
      redirect: '/notFound',
    },
  ],
};
