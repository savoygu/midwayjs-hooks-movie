import vue from '@vitejs/plugin-vue';
import { defineConfig } from '@midwayjs/hooks-kit';

export default defineConfig({
  vite: {
    server: {
      host: '0.0.0.0',
    },
    plugins: [vue()],
  },
});
