import { defineConfig } from 'vite';
import string from 'vite-plugin-string';

export default defineConfig({
  plugins: [
    string({
      include: '**/*.hbs',
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://ya-praktikum.tech',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "src/styles/_variables.scss"`,
      },
    },
  }
});
