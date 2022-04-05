import Landing from './pages/Landing.vue';
import Article from './pages/Article.vue';

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
