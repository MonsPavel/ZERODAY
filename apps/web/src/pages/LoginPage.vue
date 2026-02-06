<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiCard, UiInput } from '@zeroday/ui';
import { login, register } from '@/shared/api/http';
import { useAuthStore } from '@/stores/auth';
import { router } from '@/router';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const isLoading = ref(false);

const handleAuth = async (mode: 'login' | 'register') => {
  error.value = null;
  isLoading.value = true;
  try {
    const payload = { email: email.value.trim(), password: password.value };
    const result = mode === 'login' ? await login(payload) : await register(payload);
    authStore.setToken(result.token);
    router.replace('today');
  } catch {
    error.value = mode === 'login' ? 'Не удалось войти.' : 'Не удалось зарегистрироваться.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="login-page">
    <UiCard class="login-card">
      <template #header>Вход</template>
      <form class="stack" @submit.prevent="handleAuth('login')">
        <UiInput v-model="email" placeholder="Email" type="email" />
        <UiInput v-model="password" placeholder="Пароль" type="password" />
        <div class="actions">
          <UiButton size="sm" type="submit" :disabled="isLoading">
            {{ isLoading ? 'Вхожу...' : 'Войти' }}
          </UiButton>
          <UiButton size="sm" variant="ghost" :disabled="isLoading" @click="handleAuth('register')">
            Регистрация
          </UiButton>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </UiCard>
  </section>
</template>

<style scoped>
.login-page {
  max-width: 420px;
  margin: 40px auto 0;
}

.login-card {
  border: 1px solid var(--c-border);
}

.stack {
  display: grid;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.error {
  color: var(--c-accent);
}
</style>
