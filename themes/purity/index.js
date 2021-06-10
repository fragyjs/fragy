import './styles/anim.less';
import './styles/color.less';
import './styles/layout.less';
import Index from './pages/index.vue';
import Article from './pages/article.vue';
import NotFound from './pages/notFound.vue';

export default {
  name: 'purity',
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
