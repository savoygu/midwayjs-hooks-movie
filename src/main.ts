import { createApp } from 'vue';
import App from './App.vue';
import 'element-plus/es/components/message/style/css';
import './style.scss';
import { pinia } from './store';
import { router } from './router';

createApp(App).use(router).use(pinia).mount('#app');
