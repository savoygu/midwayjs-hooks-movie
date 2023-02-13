import { createApp } from 'vue';
import { BToastPlugin } from 'bootstrap-vue-next';
import App from './_App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import './style.scss';
import { pinia } from './store';
import { router } from './router';

createApp(App).use(router).use(pinia).use(BToastPlugin).mount('#app');
