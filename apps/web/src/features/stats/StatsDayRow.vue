<script setup lang="ts">
import { computed } from 'vue';
import { UiBadge, UiProgress } from '@zeroday/ui';
import type { HistoryDaySummary } from '@/shared/api/types';

const props = defineProps<{
  day: HistoryDaySummary;
}>();

const progressValue = computed(() => {
  if (props.day.totalCount === 0) {
    return 0;
  }
  return Math.round((props.day.doneCount / props.day.totalCount) * 100);
});

const dateLabel = computed(() => {
  const parsed = new Date(`${props.day.date}T00:00:00`);
  return new Intl.DateTimeFormat('ru-RU', { month: '2-digit', day: '2-digit' }).format(
    parsed,
  );
});
</script>

<template>
  <div
    class="row"
    :data-tooltip="`Дата: ${day.date} • DONE: ${day.doneCount} • Всего: ${day.totalCount} • Closed: ${day.completed ? 'yes' : 'no'}`"
  >
    <div class="date">{{ dateLabel }}</div>
    <div class="meta muted">{{ day.doneCount }}/{{ day.totalCount }}</div>
    <div class="bar">
      <UiProgress :value="progressValue" />
    </div>
    <UiBadge :tone="day.completed ? 'good' : 'neutral'">
      {{ day.completed ? 'DONE' : 'OPEN' }}
    </UiBadge>
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 64px 64px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  position: relative;
}

.row:last-child {
  border-bottom: none;
}

.date {
  font-weight: 600;
}

.meta {
  font-size: 12px;
}

.bar :deep(.ui-progress__track) {
  height: 8px;
}

.muted {
  color: var(--muted);
}

@media (hover: hover) {
  .row::after {
    content: attr(data-tooltip);
    position: absolute;
    left: 0;
    top: -6px;
    transform: translateY(-100%);
    background: var(--card);
    color: var(--fg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    padding: 6px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 120ms ease;
    white-space: nowrap;
    z-index: 2;
  }

  .row:hover::after {
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 54px 54px 1fr auto;
  }
}
</style>
