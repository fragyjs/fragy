import VueLazyload from 'vue-lazyload';
import { Loading } from '@any-design/anyui';
import Landing from './pages/Landing.vue';
import Article from './pages/Article.vue';
import './styles/layout.less';

export default {
  name: 'oneslot',
  setup(app) {
    app.use(VueLazyload, {
      observer: true,
    });
    app.use(Loading);
  },
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing,
      meta: {
        keepAlive: true,
        backToTop: true,
      },
    },
    {
      path: '/article/:article',
      name: 'Article',
      component: Article,
      meta: {
        backToTop: true,
      },
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/',
    },
  ],
};
