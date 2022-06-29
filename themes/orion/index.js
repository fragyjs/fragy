import VueLazyload from 'vue-lazyload';
import { PopupMenu, Popper, GradientText, Layout, Side, Content } from '@any-design/anyui';
import Landing from './pages/Landing.vue';
import Article from './pages/Article.vue';
import './styles/layout.less';

// eslint-disable-next-line no-undef
if (__IMPORT_INTER_FONT__) {
  require('inter-ui/inter-latin.css');
}

export default {
  name: 'orion',
  setup(app) {
    app.use(Popper);
    app.use(PopupMenu);
    app.use(GradientText);
    app.use(Layout);
    app.use(Side);
    app.use(Content);
    app.use(VueLazyload, {
      observer: true,
    });
  },
  routes: [
    {
      path: '/',
      component: Landing,
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/docs/:article',
      component: Article,
      meta: {
        noFooter: true,
      },
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/',
    },
  ],
};
