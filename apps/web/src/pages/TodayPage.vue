<script setup lang="ts">
import { ref } from 'vue';
import { UiButton, UiCard, UiInput, UiProgress, UiBadge } from '@zeroday/ui';

const note = ref('');
</script>

<template>
  <section class="page">
    <UiCard>
      <template #header>Daily focus</template>
      <div class="stack">
        <h2>Today</h2>
        <p>План на сегодня появится здесь.</p>
        <UiInput v-model="note" placeholder="Быстрая заметка" />
        <UiProgress :value="62" label="Progress" />
        <div class="actions">
          <UiButton size="sm">Save</UiButton>
          <UiBadge tone="unlocked">Active</UiBadge>
        </div>
      </div>
    </UiCard>
  </section>
</template>

<style scoped>
.page {
  max-width: 720px;
}

.stack {
  display: grid;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
