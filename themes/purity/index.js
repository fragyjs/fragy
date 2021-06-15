import './styles/anim.less';
import './styles/color.less';
import './styles/layout.less';
import VueLazyload from 'vue-lazyload';
import Index from './pages/index.vue';
import Article from './pages/article.vue';
import NotFound from './pages/notFound.vue';
import store from './store';

export default {
  name: 'purity',
  setup(Vue) {
    Vue.use(VueLazyload, {
      observer: true,
    });
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
