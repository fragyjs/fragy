import VueLazyload from 'vue-lazyload-next';
import Landing from './pages/Landing.vue';
import Article from './pages/Article.vue';
import './styles/layout.less';

export default {
  name: 'oneslot',
  setup(app) {
    app.use(VueLazyload, {
      observer: true,
    });
  },
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing,
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/article/:article',
      name: 'Article',
      component: Article,
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/',
    },
  ],
};
