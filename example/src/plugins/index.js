/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import store from '../store';
import router from '../router';

// eslint-disable-next-line import/no-relative-packages
import VueSocketIO from '../../../dist/vue-socket.io-pinia';

const vueSocketIO = new VueSocketIO({
  debug: true,
  connection: 'http://localhost:5000',
  pinia: {
    store,
    actionPrefix: 'socket.',
  },
  options: {
    transports: ['websocket'],
  },
});

// eslint-disable-next-line import/prefer-default-export
export function registerPlugins(app) {
  loadFonts();
  app
    .use(vuetify)
    .use(store)
    .use(router)
    .use(vueSocketIO);
}
