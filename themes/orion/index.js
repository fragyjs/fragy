import VueLazyload from 'vue-lazyload';
import axios from 'axios';
import {
  Button,
  PopupMenu,
  Popper,
  GradientText,
  Layout,
  Loading,
  Collapse,
  Drawer,
} from '@any-design/anyui';
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
    app.use(Button);
    app.use(Popper);
    app.use(PopupMenu);
    app.use(GradientText);
    app.use(Layout);
    app.use(Loading);
    app.use(Collapse);
    app.use(Drawer);
    app.use(VueLazyload, {
      observer: true,
    });
    app.config.globalProperties.$http = axios;
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
