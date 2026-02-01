<script setup lang="ts">
import { UiBadge, UiButton, UiCard, UiProgress } from '@zeroday/ui';
</script>

<template>
  <section class="page">
    <UiCard>
      <template #header>Milestones</template>
      <div class="stack">
        <h2>Achievements</h2>
        <p>Здесь будут отображаться достижения.</p>
        <UiProgress :value="28" label="Weekly unlocks" />
        <div class="badges">
          <UiBadge>Starter</UiBadge>
          <UiBadge tone="locked">Locked</UiBadge>
          <UiBadge tone="unlocked">Unlocked</UiBadge>
        </div>
        <UiButton variant="ghost" size="sm">View roadmap</UiButton>
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
