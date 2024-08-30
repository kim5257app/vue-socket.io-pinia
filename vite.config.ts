import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Vue.js Socket.io with pinia',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        dir: 'dist',
        exports: 'named',
        format: 'esm',
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
      plugins: []
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
