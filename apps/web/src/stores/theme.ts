import { defineStore } from 'pinia';
import { ref } from 'vue';

type Theme = 'mono' | 'acid';

const STORAGE_KEY = 'theme';

const isTheme = (value: string | null): value is Theme => value === 'mono' || value === 'acid';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('mono');

  const apply = () => {
    document.documentElement.dataset.theme = theme.value;
    localStorage.setItem(STORAGE_KEY, theme.value);
  };

  const init = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) {
      theme.value = stored;
    }
    apply();
  };

  const toggle = () => {
    theme.value = theme.value === 'mono' ? 'acid' : 'mono';
    apply();
  };

  return {
    theme,
    init,
    toggle,
    apply,
  };
});
