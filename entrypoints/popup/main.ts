import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { i18n, initializeI18n } from '@/i18n';

async function bootstrap() {
  await initializeI18n();
  createApp(App).use(i18n).mount('#app');
}

void bootstrap();
