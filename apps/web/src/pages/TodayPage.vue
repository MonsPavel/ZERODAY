<script setup lang="ts">
import { computed, ref } from 'vue';
import { UiBadge, UiButton, UiCard, UiInput, UiProgress } from '@zeroday/ui';
import {
  isApiError as isTodayError,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTodayQuery,
  useToggleTaskMutation,
} from '@/features/today/queries';
import { isApiError as isGameError, useFinishDayMutation, useGameStateQuery } from '@/features/game/queries';
import type { AchievementUnlocked, GameState, Mood, Task } from '@/shared/api/types';

const taskTitle = ref('');
const taskNote = ref('');
const finishMessage = ref<string | null>(null);
const finishError = ref<string | null>(null);
const inlineError = ref<string | null>(null);

const todayQuery = useTodayQuery();
const createTaskMutation = useCreateTaskMutation();
const toggleTaskMutation = useToggleTaskMutation();
const deleteTaskMutation = useDeleteTaskMutation();
const finishDayMutation = useFinishDayMutation();
const gameQuery = useGameStateQuery();

const tasks = computed(() => todayQuery.data.value?.tasks ?? []);
const completed = computed(() => todayQuery.data.value?.completed ?? false);
const dateLabel = computed(() => gameQuery.data.value?.date ?? todayQuery.data.value?.date ?? '—');

const sortedTasks = computed(() => {
  const all = tasks.value.slice();
  return all.sort((a, b) => {
    if (a.status === b.status) {
      return a.id - b.id;
    }
    return a.status === 'TODO' ? -1 : 1;
  });
});

const doneCount = computed(() => tasks.value.filter((task) => task.status === 'DONE').length);
const progressValue = computed(() => {
  if (tasks.value.length === 0) {
    return 0;
  }
  return Math.round((doneCount.value / tasks.value.length) * 100);
});

const mood = computed<Mood>(() => {
  if (gameQuery.data.value?.mood) {
    return gameQuery.data.value.mood;
  }
  if (completed.value) {
    return 'GOOD';
  }
  if (tasks.value.length === 0 || doneCount.value === 0) {
    return 'BAD';
  }
  return 'NEUTRAL';
});

const moodTone = computed(() => {
  if (mood.value === 'GOOD') {
    return 'unlocked';
  }
  if (mood.value === 'BAD') {
    return 'locked';
  }
  return 'default';
});

const fallbackMessages: Record<Mood, string[]> = {
  GOOD: ['Сделано. Ровно.', 'Ты закрыл день. Так держать.', 'Финиш есть. Респект.'],
  NEUTRAL: ['Есть прогресс, но не финиш.', 'Нормально, но добей.', 'Движ есть, точка не поставлена.'],
  BAD: ['Ноль задач — ноль выхлопа.', 'Сначала задай цель.', 'Тишина. Завтра без отмазок.'],
};

const moodMessage = computed(() => {
  if (finishMessage.value) {
    return finishMessage.value;
  }
  if (gameQuery.data.value?.message) {
    return gameQuery.data.value.message;
  }
  const pool = fallbackMessages[mood.value];
  return pool[Math.floor(Math.random() * pool.length)];
});

const timeOfDayLabel = computed(() => gameQuery.data.value?.timeOfDay ?? '—');
const tips = computed(() => gameQuery.data.value?.tips ?? []);
const streakCurrent = computed(() => gameQuery.data.value?.streak.current ?? 0);
const streakBest = computed(() => gameQuery.data.value?.streak.best ?? 0);
const streakProgress = computed(() => Math.min(100, Math.round((streakCurrent.value / 7) * 100)));

const catalog = [
  {
    code: 'FIRST_TASK_DONE',
    title: 'First task done',
    description: 'Complete your first task.',
  },
  {
    code: 'FIRST_FINISHED_DAY',
    title: 'First finished day',
    description: 'Finish all tasks in a day.',
  },
  {
    code: 'NO_ZERO_3',
    title: 'No zero days',
    description: 'Complete at least one task for 3 days in a row.',
  },
  {
    code: 'PERFECT_DAY',
    title: 'Perfect day',
    description: 'Complete all tasks in a single day.',
  },
  {
    code: 'STREAK_7',
    title: 'Streak 7',
    description: 'Reach a 7 day streak.',
  },
];

const achievements = computed(() => {
  const unlocked = gameQuery.data.value?.achievements ?? [];
  const unlockedMap = new Map(unlocked.map((item) => [item.code, item]));
  const list = catalog.map((item) => ({
    ...item,
    unlocked: unlockedMap.get(item.code),
  }));

  return list.sort((a, b) => {
    if (a.unlocked && b.unlocked) {
      return b.unlocked.unlockedAt.localeCompare(a.unlocked.unlockedAt);
    }
    if (a.unlocked) {
      return -1;
    }
    if (b.unlocked) {
      return 1;
    }
    return a.title.localeCompare(b.title);
  });
});

const canFinish = computed(
  () => tasks.value.length > 0 && doneCount.value === tasks.value.length,
);

const mapFinishError = (code?: string) => {
  if (code === 'NO_TASKS') {
    return 'Ноль задач. Сначала задай хоть одну.';
  }
  if (code === 'NOT_ALL_DONE') {
    return 'Сначала добей хвосты. Потом закрываем день.';
  }
  return 'Что-то пошло не так. Попробуй ещё раз.';
};

const handleAdd = async () => {
  inlineError.value = null;
  const title = taskTitle.value.trim();
  const note = taskNote.value.trim();
  if (!title) {
    inlineError.value = 'Название задачи не может быть пустым.';
    return;
  }
  try {
    await createTaskMutation.mutateAsync({ title, note: note || undefined });
    taskTitle.value = '';
    taskNote.value = '';
  } catch (error) {
    if (isTodayError(error)) {
      inlineError.value = error.message;
    } else {
      inlineError.value = 'Не удалось создать задачу.';
    }
  }
};

const handleToggle = async (task: Task) => {
  inlineError.value = null;
  try {
    await toggleTaskMutation.mutateAsync(task.id);
  } catch (error) {
    inlineError.value = isTodayError(error) ? error.message : 'Не удалось обновить задачу.';
  }
};

const handleDelete = async (task: Task) => {
  inlineError.value = null;
  try {
    await deleteTaskMutation.mutateAsync(task.id);
  } catch (error) {
    inlineError.value = isTodayError(error) ? error.message : 'Не удалось удалить задачу.';
  }
};

const handleFinish = async () => {
  finishError.value = null;
  finishMessage.value = null;
  try {
    const result = await finishDayMutation.mutateAsync();
    finishMessage.value = result.message;
  } catch (error) {
    if (isGameError(error)) {
      finishError.value = mapFinishError(error.code);
    } else {
      finishError.value = 'Не удалось закрыть день.';
    }
  }
};
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h2>Today</h2>
        <p class="muted">Дата: {{ dateLabel }}</p>
      </div>
      <UiBadge :tone="moodTone">{{ mood }}</UiBadge>
    </div>

    <UiCard>
      <template #header>Punk bro</template>
      <div class="stack">
        <div class="row">
          <UiBadge :tone="moodTone">{{ mood }}</UiBadge>
          <span class="muted">{{ timeOfDayLabel }}</span>
        </div>
        <p v-if="gameQuery.isLoading.value" class="muted">...</p>
        <p v-else class="message">{{ moodMessage }}</p>
        <div v-if="tips.length" class="tips">
          <UiBadge v-for="tip in tips" :key="tip" tone="default">{{ tip }}</UiBadge>
        </div>
        <UiProgress :value="progressValue" label="Progress" />
      </div>
    </UiCard>

    <UiCard>
      <template #header>Streak</template>
      <div class="stack">
        <div class="row">
          <span class="streak-number">{{ streakCurrent }}</span>
          <span class="muted">best {{ streakBest }}</span>
        </div>
        <UiProgress :value="streakProgress" label="To 7 days" />
      </div>
    </UiCard>

    <UiCard>
      <template #header>Achievements</template>
      <div class="stack">
        <div v-if="gameQuery.isLoading.value" class="muted">Loading...</div>
        <div v-else class="achievements">
          <div
            v-for="item in achievements"
            :key="item.code"
            :class="['achievement', !item.unlocked && 'achievement--locked']"
          >
            <div class="row">
              <UiBadge :tone="item.unlocked ? 'unlocked' : 'locked'">
                {{ item.unlocked ? 'Unlocked' : 'Locked' }}
              </UiBadge>
              <span class="muted">{{ item.code }}</span>
            </div>
            <div class="achievement-title">{{ item.title }}</div>
            <div class="achievement-desc">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </UiCard>

    <UiCard>
      <template #header>Add task</template>
      <form class="stack" @submit.prevent="handleAdd">
        <UiInput v-model="taskTitle" placeholder="Название задачи" />
        <UiInput v-model="taskNote" placeholder="Заметка (опционально)" />
        <div class="actions">
          <UiButton
            size="sm"
            type="submit"
            :disabled="createTaskMutation.isPending.value"
          >
            {{ createTaskMutation.isPending.value ? 'Adding...' : 'Add task' }}
          </UiButton>
          <span v-if="inlineError" class="error">{{ inlineError }}</span>
        </div>
      </form>
    </UiCard>

    <UiCard>
      <template #header>Tasks</template>
      <div class="stack">
        <div v-if="todayQuery.isLoading.value" class="muted">Loading...</div>
        <div v-else-if="todayQuery.isError.value" class="error">
          Не удалось загрузить задачи.
        </div>
        <div v-else-if="sortedTasks.length === 0" class="muted">
          Пока нет задач.
        </div>
        <div v-else class="task-list">
          <div v-for="task in sortedTasks" :key="task.id" class="task-row">
            <div class="task-main">
              <UiButton
                size="sm"
                variant="ghost"
                :disabled="toggleTaskMutation.isPending.value"
                @click="handleToggle(task)"
              >
                {{ task.status === 'DONE' ? '✔' : '○' }}
              </UiButton>
              <div>
                <div :class="['task-title', task.status === 'DONE' && 'task-title--done']">
                  {{ task.title }}
                </div>
                <div v-if="task.note" class="task-note">{{ task.note }}</div>
              </div>
            </div>
            <div class="task-actions">
              <UiBadge :tone="task.status === 'DONE' ? 'unlocked' : 'default'">
                {{ task.status }}
              </UiBadge>
              <UiButton
                size="sm"
                variant="ghost"
                :disabled="deleteTaskMutation.isPending.value"
                @click="handleDelete(task)"
              >
                Delete
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </UiCard>

    <UiCard>
      <template #header>Finish day</template>
      <div class="stack">
        <UiButton
          size="sm"
          :disabled="finishDayMutation.isPending.value || !canFinish"
          @click="handleFinish"
        >
          {{ finishDayMutation.isPending.value ? 'Finishing...' : 'Finish day' }}
        </UiButton>
        <p v-if="finishError" class="error">{{ finishError }}</p>
      </div>
    </UiCard>
  </section>
</template>

<style scoped>
.page {
  max-width: 760px;
  display: grid;
  gap: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stack {
  display: grid;
  gap: 12px;
}
.row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.streak-number {
  font-size: 28px;
  font-weight: 700;
}

.achievements {
  display: grid;
  gap: 10px;
}

.achievement {
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  padding: 12px;
  background: var(--c-surface);
}

.achievement--locked {
  opacity: 0.6;
}

.achievement-title {
  font-weight: 600;
}

.achievement-desc {
  font-size: 13px;
  color: var(--c-muted);
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-list {
  display: grid;
  gap: 12px;
}

.task-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--c-border);
}

.task-row:last-child {
  border-bottom: none;
}

.task-main {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.task-title {
  font-weight: 600;
}

.task-title--done {
  text-decoration: line-through;
  color: var(--c-muted);
}

.task-note {
  font-size: 13px;
  color: var(--c-muted);
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.muted {
  color: var(--c-muted);
}

.error {
  color: var(--c-accent);
}

.message {
  font-size: 14px;
}
</style>
