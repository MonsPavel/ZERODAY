<script setup lang="ts">
import { computed, ref } from 'vue';
import { UiBadge, UiButton, UiCard } from '@zeroday/ui';
import { useStatsQuery } from '@/features/stats/queries';
import StatsDayRow from '@/features/stats/StatsDayRow.vue';

const STORAGE_KEY = 'statsRange';
const range = ref<7 | 14>(7);

const loadRange = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === '7' || stored === '14') {
    range.value = Number(stored) as 7 | 14;
  }
};
const statsQuery = useStatsQuery(range);

const days = computed(() => {
  const list = statsQuery.data.value?.days ?? [];
  return list.slice().reverse();
});

const completedDays = computed(
  () => statsQuery.data.value?.days.filter((day) => day.completed).length ?? 0,
);
const totalDone = computed(
  () => statsQuery.data.value?.days.reduce((sum, day) => sum + day.doneCount, 0) ?? 0,
);
const totalTasks = computed(
  () => statsQuery.data.value?.days.reduce((sum, day) => sum + day.totalCount, 0) ?? 0,
);
const streak = computed(() => statsQuery.data.value?.streak ?? { current: 0, best: 0 });

const averageTrendUp = computed(() => {
  const list = days.value.slice(-3);
  if (list.length < 3) {
    return false;
  }
  const ratios = list.map((day) =>
    day.totalCount === 0 ? 0 : day.doneCount / day.totalCount,
  );
  return ratios[0] < ratios[1] && ratios[1] < ratios[2];
});

const insight = computed(() => {
  if (completedDays.value === 0) {
    return 'Ноль закрытых дней. Начнём с одного.';
  }
  if (averageTrendUp.value) {
    return 'Темп растёт. Держи.';
  }
  return `Есть движение: ${completedDays.value} закрытых дней.`;
});

const setRange = (value: 7 | 14) => {
  range.value = value;
  localStorage.setItem(STORAGE_KEY, String(value));
};

loadRange();
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h2>Stats</h2>
        <p class="muted">Короткая сводка за период</p>
      </div>
      <div class="range">
        <button
          class="segment"
          :class="range === 7 && 'segment--active'"
          type="button"
          @click="setRange(7)"
        >
          7
        </button>
        <button
          class="segment"
          :class="range === 14 && 'segment--active'"
          type="button"
          @click="setRange(14)"
        >
          14
        </button>
      </div>
    </div>

    <div class="summary">
      <UiCard>
        <template #header>Days closed</template>
        <div class="summary-value">
          {{ completedDays }} / {{ range }}
        </div>
      </UiCard>
      <UiCard>
        <template #header>Tasks done</template>
        <div class="summary-value">
          {{ totalDone }} / {{ totalTasks }}
        </div>
      </UiCard>
      <UiCard>
        <template #header>Streak</template>
        <div class="summary-row">
          <UiBadge tone="default">Current: {{ streak.current }}</UiBadge>
          <UiBadge tone="default">Best: {{ streak.best }}</UiBadge>
        </div>
      </UiCard>
    </div>

    <UiCard>
      <template #header>Daily progress</template>
      <div class="stack">
        <div v-if="statsQuery.isLoading.value" class="muted">Loading...</div>
        <div v-else-if="statsQuery.isError.value" class="muted">
          Не удалось загрузить статистику.
        </div>
        <div v-else-if="totalTasks === 0" class="muted">
          Пока нечего считать. Сначала сделай что-нибудь.
        </div>
        <div v-else class="list">
          <StatsDayRow v-for="day in days" :key="day.date" :day="day" />
        </div>
      </div>
    </UiCard>

    <UiCard>
      <template #header>Insight</template>
      <p class="message">{{ insight }}</p>
    </UiCard>
  </section>
</template>

<style scoped>
.page {
  max-width: 820px;
  display: grid;
  gap: 16px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.range {
  display: flex;
  gap: 6px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--card);
}

.segment {
  border: none;
  background: transparent;
  color: var(--fg);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
}

.segment--active {
  background: var(--accent);
  color: var(--accent-contrast);
}

.summary {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-value {
  font-size: 22px;
  font-weight: 700;
}

.summary-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stack {
  display: grid;
  gap: 12px;
}

.list {
  display: grid;
  gap: 4px;
}

.muted {
  color: var(--muted);
}

.message {
  font-size: 14px;
}

@media (max-width: 720px) {
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
