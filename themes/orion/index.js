import { PopupMenu, Popper, GradientText } from '@any-design/anyui';
import Landing from './pages/Landing.vue';
import './styles/layout.less';

export default {
  name: 'orion',
  setup(app) {
    app.use(Popper);
    app.use(PopupMenu);
    app.use(GradientText);
  },
  routes: [
    {
      path: '/',
      component: Landing,
    },
  ],
};
