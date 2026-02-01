<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { UiBadge, UiButton, UiCard } from '@zeroday/ui';
import { useHistoryDayQuery, useHistoryQuery } from '@/features/history/queries';
import StreakTrail from '@/features/history/StreakTrail.vue';
import type { HistoryDaySummary } from '@/shared/api/types';

const range = ref<7 | 14 | 30>(7);
const selectedDate = ref<string | null>(null);
const selectedSummary = ref<HistoryDaySummary | null>(null);
const drawerRef = ref<HTMLDivElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const lastFocused = ref<HTMLElement | null>(null);

const historyQuery = useHistoryQuery(range);
const dayQuery = useHistoryDayQuery(selectedDate);

const sortedDays = computed(() => historyQuery.data.value?.days ?? []);

const moodTone = (day: { completed: boolean; doneCount: number; totalCount: number }) => {
  if (day.completed) {
    return 'good';
  }
  if (day.totalCount === 0 || day.doneCount === 0) {
    return 'bad';
  }
  return 'neutral';
};

const moodLabel = (day: { completed: boolean; doneCount: number; totalCount: number }) => {
  if (day.completed) {
    return 'GOOD';
  }
  if (day.totalCount === 0 || day.doneCount === 0) {
    return 'BAD';
  }
  return 'NEUTRAL';
};

const closeDrawer = () => {
  selectedDate.value = null;
  selectedSummary.value = null;
};

const openDrawer = (day: HistoryDaySummary) => {
  selectedDate.value = day.date;
  selectedSummary.value = day;
};

const drawerMood = computed(() => {
  if (dayQuery.data.value) {
    return moodLabel({
      completed: dayQuery.data.value.completed,
      doneCount: dayQuery.data.value.tasks.filter((task) => task.status === 'DONE').length,
      totalCount: dayQuery.data.value.tasks.length,
    });
  }
  if (selectedSummary.value) {
    return moodLabel(selectedSummary.value);
  }
  return 'NEUTRAL';
});

const onKeydown = (event: KeyboardEvent) => {
  if (!selectedDate.value) {
    return;
  }
  if (event.key === 'Escape') {
    closeDrawer();
    return;
  }
  if (event.key !== 'Tab') {
    return;
  }
  const container = drawerRef.value;
  if (!container) {
    return;
  }
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute('disabled'));
  if (focusable.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
});

watch(selectedDate, async (value) => {
  if (value) {
    lastFocused.value = document.activeElement as HTMLElement | null;
    await nextTick();
    (closeButtonRef.value ?? drawerRef.value)?.focus();
  } else if (lastFocused.value) {
    lastFocused.value.focus();
  }
});
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h2>History</h2>
        <p class="muted">Последние дни и прогресс</p>
      </div>
      <div class="range">
        <UiButton
          v-for="value in [7, 14, 30]"
          :key="value"
          size="sm"
          :variant="range === value ? 'primary' : 'ghost'"
          @click="range = value as 7 | 14 | 30"
        >
          {{ value }}
        </UiButton>
      </div>
    </div>

    <UiCard>
      <template #header>Streak trail</template>
      <div class="stack">
        <StreakTrail :days="sortedDays" />
        <div class="streak-meta">
          <UiBadge tone="default">Current: {{ historyQuery.data.value?.streak.current ?? 0 }}</UiBadge>
          <UiBadge tone="default">Best: {{ historyQuery.data.value?.streak.best ?? 0 }}</UiBadge>
        </div>
      </div>
    </UiCard>

    <UiCard>
      <template #header>Days</template>
      <div class="stack">
        <div v-if="historyQuery.isLoading.value" class="muted">Loading...</div>
        <div v-else class="list">
          <button
            v-for="day in sortedDays"
            :key="day.date"
            class="row"
            type="button"
            @click="openDrawer(day)"
          >
            <div>
              <div class="date">{{ day.date }}</div>
              <div class="muted">{{ day.doneCount }}/{{ day.totalCount }} done</div>
            </div>
            <UiBadge :tone="moodTone(day)">{{ moodLabel(day) }}</UiBadge>
          </button>
        </div>
      </div>
    </UiCard>

    <div v-if="selectedDate" class="drawer-overlay" @click="closeDrawer">
      <div ref="drawerRef" class="drawer" tabindex="-1" @click.stop>
        <div class="drawer-header">
          <div>
            <div class="date">{{ selectedDate }}</div>
            <UiBadge :tone="drawerMood === 'GOOD' ? 'good' : drawerMood === 'BAD' ? 'bad' : 'neutral'">
              {{ drawerMood }}
            </UiBadge>
          </div>
          <UiButton ref="closeButtonRef" size="sm" variant="ghost" @click="closeDrawer">
            Close
          </UiButton>
        </div>
        <div class="stack">
          <div v-if="dayQuery.isLoading.value" class="muted">Loading...</div>
          <div v-else-if="dayQuery.isError.value" class="muted">
            Не удалось загрузить день.
          </div>
          <div v-else-if="dayQuery.data.value?.tasks.length === 0" class="muted">
            Ноль задач. Панк-бро говорит: «Сначала добавь хоть одну».
          </div>
          <div v-else class="tasks">
            <div v-for="task in dayQuery.data.value?.tasks ?? []" :key="task.id" class="task">
              <span :class="['task-title', task.status === 'DONE' && 'task-title--done']">
                {{ task.title }}
              </span>
              <UiBadge :tone="task.status === 'DONE' ? 'good' : 'neutral'">
                {{ task.status }}
              </UiBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
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

.stack {
  display: grid;
  gap: 12px;
}

.range {
  display: flex;
  gap: 8px;
}

.streak-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.list {
  display: grid;
  gap: 8px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.row:last-child {
  border-bottom: none;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--bg) 40%, transparent);
  display: flex;
  justify-content: flex-end;
  z-index: 30;
}

.drawer {
  width: min(420px, 92vw);
  height: 100%;
  background: var(--card);
  border-left: 1px solid var(--border);
  padding: 16px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  animation: drawerIn 180ms ease-out;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

@media (max-width: 640px) {
  .drawer-overlay {
    align-items: flex-end;
  }

  .drawer {
    width: 100%;
    height: auto;
    max-height: 80vh;
    border-left: none;
    border-top: 1px solid var(--border);
    border-top-left-radius: var(--radius-md);
    border-top-right-radius: var(--radius-md);
    animation: drawerUp 180ms ease-out;
  }
}

@keyframes drawerIn {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes drawerUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .drawer {
    animation: none;
  }
}

.date {
  font-weight: 600;
}

.tasks {
  display: grid;
  gap: 8px;
}

.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.task-title--done {
  text-decoration: line-through;
  color: var(--muted);
}

.muted {
  color: var(--muted);
}
</style>
