<script setup lang="ts">
import { UiBadge, UiButton, UiCard, UiProgress } from '@zeroday/ui';
</script>

<template>
  <section class="page">
    <UiCard>
      <template #header>Вехи</template>
      <div class="stack">
        <h2>Достижения</h2>
        <p>Здесь будут отображаться достижения.</p>
        <UiProgress :value="28" label="За неделю" />
        <div class="badges">
          <UiBadge>Старт</UiBadge>
          <UiBadge tone="locked">Закрыто</UiBadge>
          <UiBadge tone="unlocked">Открыто</UiBadge>
        </div>
        <UiButton variant="ghost" size="sm">Смотреть план</UiButton>
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

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
