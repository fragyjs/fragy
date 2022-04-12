import Landing from './pages/Landing.vue';
import Article from './pages/Article.vue';
import './styles/layout.less';

export default {
  name: 'oneslot',
  routes: [
    {
      path: '/',
      component: Landing,
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/article/:article',
      component: Article,
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/',
    },
  ],
};
