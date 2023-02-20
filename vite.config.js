import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'Vue.js Socket.io with pinia',
      formats: ['es', 'cjs', 'umd', 'iife'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          debug: 'debug',
          'socket.io-client': 'SocketIO',
        },
      },
      external: [
        'vue',
        'debug',
        'socket.io-client',
      ],
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
