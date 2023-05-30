// Utilities
import { defineStore } from 'pinia';

export default defineStore('app', {
  state: () => ({
    connected: false,
  }),
  actions: {
    'socket.connect': async function (io) {
      console.log('socket connected:', io);
      this.connected = true;
    },
  },
});
