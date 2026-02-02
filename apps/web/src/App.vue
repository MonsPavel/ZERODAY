<script setup lang="ts">
import { computed } from 'vue';
import { UiButton } from '@zeroday/ui';
import { useThemeStore } from './stores/theme';

const themeStore = useThemeStore();
const toggleLabel = computed(() => (themeStore.theme === 'mono' ? 'Acid' : 'Mono'));
</script>

<template>
  <div class="layout">
    <header class="header">
      <div class="brand">
        <h1 class="title">Zeroday</h1>
        <span class="subtitle">UI Kit</span>
      </div>
      <nav class="nav">
        <RouterLink class="nav-link" to="/today">Today</RouterLink>
        <RouterLink class="nav-link" to="/achievements">Achievements</RouterLink>
        <RouterLink class="nav-link" to="/history">History</RouterLink>
        <RouterLink class="nav-link" to="/goals">Goals</RouterLink>
        <RouterLink class="nav-link" to="/stats">Stats</RouterLink>
        <UiButton variant="ghost" size="sm" @click="themeStore.toggleTheme()">
          Theme: {{ toggleLabel }}
        </UiButton>
      </nav>
    </header>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: var(--font-sans);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-surface);
  gap: 24px;
}

.title {
  margin: 0;
  font-size: 20px;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.subtitle {
  font-size: 12px;
  color: var(--c-muted);
}

.nav {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-link {
  color: var(--c-text);
  font-weight: 600;
}

.nav-link:hover {
  text-decoration: underline;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
