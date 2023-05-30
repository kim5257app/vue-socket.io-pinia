/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import pinia from '../store';
import router from '../router';

// eslint-disable-next-line import/no-relative-packages
import VueSocketIO from '../../../src';

import appStore from '../store/app';

// eslint-disable-next-line import/prefer-default-export
export function registerPlugins(app) {
  loadFonts();
  app
    .use(vuetify)
    .use(pinia)
    .use(router);

  const vueSocketIO = new VueSocketIO({
    debug: true,
    connection: 'https://msg.manolab.co.kr',
    pinia: {
      store: appStore(),
      actionPrefix: 'socket.',
    },
    options: {
      transports: ['websocket'],
    },
  });

  app.use(vueSocketIO);
}
