import { defineStore } from 'pinia'
import { Socket } from 'socket.io-client';

export const useAppStore = defineStore('app', {
  state: () => ({
    connected: false,
  }),
  actions: {
    'socket.connect': function (io: Socket) {
      console.log('connected:', io, this);
      this.$state.connected = true;
    },
    'socket.testpong': function (_, payload) {
      console.log('pong in appStore:', payload);
    },
  },
})
