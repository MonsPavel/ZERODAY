import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import '@zeroday/ui/styles/base.css';
import '@zeroday/ui/styles/theme.css';
import './styles/theme.css';
import App from './App.vue';
import { router } from './router';
import { useThemeStore } from './stores/theme';

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(VueQueryPlugin);
app.use(router);

const themeStore = useThemeStore(pinia);
themeStore.init();

app.mount('#app');
