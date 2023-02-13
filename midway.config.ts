import vue from '@vitejs/plugin-vue';
import { defineConfig } from '@midwayjs/hooks-kit';
import Components from 'unplugin-vue-components/vite';
// import { BootstrapVue3Resolver as BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers';
import { BootstrapVueNextResolver } from './resolver';

export default defineConfig({
  vite: {
    // resolve: {
    //   alias: {
    //     'bootstrap-vue-3': 'bootstrap-vue-next',
    //   },
    // },
    server: {
      host: '0.0.0.0',
    },
    plugins: [
      vue(),
      Components({
        resolvers: [BootstrapVueNextResolver()],
      }),
    ],
  },
});
