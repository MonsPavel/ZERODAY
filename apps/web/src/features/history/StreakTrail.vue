<script setup lang="ts">
import { computed } from 'vue';
import type { HistoryDaySummary } from '@/shared/api/types';

const props = defineProps<{
  days: HistoryDaySummary[];
}>();

const ordered = computed(() => props.days.slice().reverse());
</script>

<template>
  <div class="trail">
    <div
      v-for="day in ordered"
      :key="day.date"
      :class="[
        'cell',
        day.completed && 'cell--done',
        !day.completed && day.totalCount > 0 && 'cell--partial',
      ]"
      :title="`${day.date} (${day.doneCount}/${day.totalCount})`"
    />
  </div>
</template>

<style scoped>
.trail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 16px;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.cell {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: transparent;
}

.cell--done {
  background: var(--accent);
  border-color: var(--accent);
}

.cell--partial {
  background: linear-gradient(180deg, var(--accent) 50%, transparent 50%);
  border-color: var(--accent);
}
</style>
