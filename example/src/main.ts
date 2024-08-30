import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vueSocket from 'vue-socket.io-pinia';

import App from './App.vue'
import router from './router'
import { useAppStore } from '@/stores/app';

const app = createApp(App);

app.use(createPinia())
app.use(router)
app.use(vueSocket, {
  connection: 'http://localhost:4000',
  actionPrefix: 'socket.',
  store: useAppStore(),
  socketOptions: {
    transports: ['websocket'],
  },
  debug: true,
});

app.mount('#app')
