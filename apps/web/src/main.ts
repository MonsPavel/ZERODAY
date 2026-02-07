import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import '@zeroday/ui/styles/base.css';
import '@zeroday/ui/styles/theme.css';
import './styles/theme.css';
import App from './App.vue';
import { router } from './router';
import { useThemeStore } from './stores/theme';
import { decodeJwtPayload, useAuthStore, AUTH_TOKEN_KEY } from './stores/auth';
import { pinia } from './stores/pinia';
import { queryClient } from './shared/queryClient';

const app = createApp(App);

app.use(pinia);
app.use(VueQueryPlugin, { queryClient });
app.use(router);

const themeStore = useThemeStore(pinia);
themeStore.init();

const authStore = useAuthStore(pinia);
const currentToken = authStore.token;
if (currentToken) {
  const payload = decodeJwtPayload(currentToken);
  const exp = payload?.exp;
  if (typeof exp === 'number' && exp * 1000 <= Date.now()) {
    authStore.clearToken();
    queryClient.clear();
    router.replace('login');
  }
}

window.addEventListener('storage', (event) => {
  if (event.key !== AUTH_TOKEN_KEY) {
    return;
  }
  const nextToken = event.newValue;
  if (nextToken) {
    authStore.setToken(nextToken);
    return;
  }
  authStore.clearToken();
  queryClient.clear();
  router.replace('login');
});

app.mount('#app');
