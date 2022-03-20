import { PopupMenu, Popper } from '@any-design/anyui';
import Landing from './pages/Landing.vue';
import './styles/layout.less';

export default {
  name: 'orion',
  setup(app) {
    app.use(Popper);
    app.use(PopupMenu);
  },
  routes: [
    {
      path: '/',
      component: Landing,
    },
  ],
};
