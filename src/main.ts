import { createApp } from 'vue';
import App from './_App.vue';
import './style.scss';
import { pinia } from './store';
import { router } from './router';

createApp(App).use(router).use(pinia).mount('#app');
