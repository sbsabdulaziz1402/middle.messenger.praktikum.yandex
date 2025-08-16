import { defineConfig } from 'vite';
import string from 'vite-plugin-string';

export default defineConfig({
  plugins: [
    string({
      include: '**/*.hbs',
    }),
  ],
  server: {
    port: 3000, // ставь свой порт
  },
});
