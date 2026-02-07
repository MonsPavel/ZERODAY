import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const AUTH_TOKEN_KEY = 'zeroday_token';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(AUTH_TOKEN_KEY));

  const isAuthenticated = computed(() => Boolean(token.value));

  const setToken = (nextToken: string) => {
    token.value = nextToken;
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
  };

  const clearToken = () => {
    token.value = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  return {
    token,
    isAuthenticated,
    setToken,
    clearToken,
  };
});

export const decodeJwtPayload = (token: string): { exp?: number } | null => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }
  const payload = parts[1];
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  try {
    const json = atob(padded);
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
};
