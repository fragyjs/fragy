import './styles/color.less';
import './styles/layout.less';

export default {
  routes: [
    {
      path: '/',
      component: () => import('./pages/index.vue'),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/article/:name',
      component: () => import('./pages/article.vue'),
    },
  ],
};
