// Utilities
import { defineStore } from 'pinia';

export default defineStore('app', {
  state: () => ({
    connected: false,
  }),
  actions: {
    'socket.connect': function () {
      console.log('socket connected');
      this.connected = true;
    },
  },
});
