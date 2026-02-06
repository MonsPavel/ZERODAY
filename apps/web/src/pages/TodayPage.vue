<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { UiBadge, UiButton, UiCard, UiInput, UiProgress } from '@zeroday/ui';
import {
  isApiError as isTodayError,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTodayQuery,
  useToggleTaskMutation,
} from '@/features/today/queries';
import { isApiError as isGameError, useFinishDayMutation, useGameStateQuery } from '@/features/game/queries';
import AchievementsGrid from '@/features/game/AchievementsGrid.vue';
import { GOAL_TYPE_MAP } from '@/features/goals/goalType.map';
import type { Mood, Task } from '@/shared/api/types';
import TodaySkeleton from './TodaySkeleton.vue';

const taskTitle = ref('');
const taskNote = ref('');
const finishMessage = ref<string | null>(null);
const finishError = ref<string | null>(null);
const inlineError = ref<string | null>(null);
const onboardingVisible = ref(false);
const onboardingMounted = ref(false);
const ONBOARDING_KEY = 'zeroday_onboarded';

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
    return 'good';
  }
  if (mood.value === 'BAD') {
    return 'bad';
  }
  return 'neutral';
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
const goalsSummary = computed(() => gameQuery.data.value?.goalsSummary);
const topGoal = computed(() => goalsSummary.value?.topGoal ?? null);
const goalsCompletedToday = computed(() => goalsSummary.value?.completedTodayCount ?? 0);

const showSkeleton = computed(
  () =>
    gameQuery.isLoading.value ||
    gameQuery.isFetching.value ||
    todayQuery.isLoading.value ||
    todayQuery.isFetching.value,
);

const canFinish = computed(
  () => tasks.value.length > 0 && doneCount.value === tasks.value.length,
);

const step1Done = computed(() => tasks.value.length > 0);
const step2Done = computed(() => doneCount.value > 0);
const step3Done = computed(() => completed.value);

const markOnboarded = () => {
  onboardingVisible.value = false;
  localStorage.setItem(ONBOARDING_KEY, '1');
};


const updateOnboardingState = () => {
  if (step3Done.value) {
    markOnboarded();
  }
};

const mapFinishError = (code?: string) => {
  if (code === 'NO_TASKS') {
    return 'Ноль задач. День ещё не начался.';
  }
  if (code === 'NOT_ALL_DONE') {
    return 'Хвосты остались. Добей их.';
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

onMounted(() => {
  onboardingMounted.value = true;
  const onboarded = localStorage.getItem(ONBOARDING_KEY) === '1';
  onboardingVisible.value = !onboarded;
  updateOnboardingState();
});

watch([step1Done, step2Done, step3Done], updateOnboardingState);
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

    <transition name="fade">
      <UiCard v-if="onboardingVisible && onboardingMounted" class="onboarding-card">
        <template #header>Первый заход</template>
        <div class="onboarding">
          <div class="onboarding-list">
            <div class="onboarding-item">
              <span :class="['check', step1Done && 'check--done']">•</span>
              <span>Добавь 1 задачу на сегодня.</span>
            </div>
            <div class="onboarding-item">
              <span :class="['check', step2Done && 'check--done']">•</span>
              <span>Закрой её. DONE — значит DONE.</span>
            </div>
            <div class="onboarding-item">
              <span :class="['check', step3Done && 'check--done']">•</span>
              <span>Закрой день. Забери стрик.</span>
            </div>
          </div>
          <div class="onboarding-actions">
            <UiButton size="sm" @click="markOnboarded">Понял</UiButton>
            <UiButton size="sm" variant="ghost" @click="markOnboarded">Skip</UiButton>
          </div>
        </div>
      </UiCard>
    </transition>

    <TodaySkeleton v-if="showSkeleton" />
    <template v-else>
      <UiCard class="punk-card">
        <template #header>Punk bro</template>
        <div class="stack">
          <div class="row">
            <span class="mood-icon" :data-mood="mood" aria-hidden="true" />
            <UiBadge :tone="moodTone">{{ mood }}</UiBadge>
            <span class="muted">{{ timeOfDayLabel }}</span>
          </div>
          <p class="message">{{ moodMessage }}</p>
          <div v-if="tips.length" class="tips">
            <UiBadge v-for="tip in tips" :key="tip" tone="default">{{ tip }}</UiBadge>
          </div>
          <UiProgress :value="progressValue" label="Прогресс" />
        </div>
      </UiCard>

    </template>

    <UiCard>
      <template #header>Цели</template>
      <div class="stack">
        <div v-if="gameQuery.isLoading.value" class="muted">Загрузка...</div>
        <div v-else-if="!topGoal" class="muted">Целей нет — выбери, куда бить.</div>
        <div v-else class="stack">
          <div class="row">
            <div>
              <div class="goal-title">{{ topGoal.title }}</div>
              <div class="muted">
                {{ topGoal.progressInt }} / {{ topGoal.targetInt }}
                {{ GOAL_TYPE_MAP[topGoal.type].progressUnit }}
              </div>
            </div>
            <UiBadge tone="default">Главная цель</UiBadge>
          </div>
          <UiProgress
            :value="Math.min(100, Math.round((topGoal.progressInt / topGoal.targetInt) * 100))"
          />
        </div>
        <p v-if="goalsCompletedToday > 0" class="message">
          Цель закрыта. Панк-бро одобряет.
        </p>
      </div>
    </UiCard>

    <UiCard>
      <template #header>Достижения</template>
      <div class="stack">
        <div v-if="gameQuery.isLoading.value" class="muted">Загрузка...</div>
        <div v-else>
          <p v-if="(gameQuery.data.value?.achievements.length ?? 0) === 0" class="muted">
            Достижения появляются по ходу. Ничего выбивать специально не нужно.
          </p>
          <AchievementsGrid :achievements="gameQuery.data.value?.achievements ?? []" />
        </div>
      </div>
    </UiCard>

    <UiCard>
      <template #header>Добавить задачу</template>
      <form class="stack" @submit.prevent="handleAdd">
        <UiInput v-model="taskTitle" placeholder="Название задачи" />
        <UiInput v-model="taskNote" placeholder="Заметка (опционально)" />
        <div class="actions">
          <UiButton
            size="sm"
            type="submit"
            :disabled="createTaskMutation.isPending.value"
          >
            {{ createTaskMutation.isPending.value ? 'Добавляю...' : 'Добавить' }}
          </UiButton>
          <span v-if="inlineError" class="error">{{ inlineError }}</span>
        </div>
        <p v-if="tasks.length === 0 && !onboardingVisible" class="muted">
          Пусто. Добавь первую задачу — и поехали.
        </p>
      </form>
    </UiCard>

    <UiCard class="tasks-card">
      <template #header>Задачи</template>
      <div class="stack">
        <div v-if="todayQuery.isError.value" class="error">
          Не удалось загрузить задачи.
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
                Удалить
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </UiCard>

    <UiCard>
      <template #header>Закрыть день</template>
      <div class="stack">
        <UiButton
          size="sm"
          :disabled="finishDayMutation.isPending.value || !canFinish"
          @click="handleFinish"
        >
          {{ finishDayMutation.isPending.value ? 'Закрываю...' : 'Закрыть день' }}
        </UiButton>
        <p v-if="tasks.length > 0 && doneCount === 0" class="muted">
          Сначала закрой хотя бы одну.
        </p>
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

.onboarding-card {
  border: 1px solid var(--border);
}

.onboarding {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.onboarding-list {
  display: grid;
  gap: 8px;
}

.onboarding-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  color: var(--fg);
}

.check {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
}

.check--done {
  border-color: var(--accent);
  color: var(--accent);
}

.onboarding-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 160ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

.mood-icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--fg);
  font-weight: 700;
  font-size: 12px;
}

.mood-icon[data-mood='GOOD']::before {
  content: '✓';
  color: var(--good);
}

.mood-icon[data-mood='NEUTRAL']::before {
  content: '—';
  color: var(--neutral);
}

.mood-icon[data-mood='BAD']::before {
  content: '!';
  color: var(--bad);
}

.punk-card {
  position: relative;
  overflow: hidden;
  min-height: 170px;
}
.tasks-card {
  min-height: 240px;
}

.punk-card::after {
  content: '';
  position: absolute;
  left: -30%;
  right: -30%;
  top: 0;
  height: 1px;
  background: var(--accent);
  opacity: 0.35;
  transform: translateY(-10px);
  animation: scanline 1.2s ease-out 1;
}

@keyframes scanline {
  0% {
    transform: translateY(-10px);
    opacity: 0.1;
  }
  60% {
    opacity: 0.35;
  }
  100% {
    transform: translateY(120px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .punk-card::after {
    animation: none;
  }
}

.tips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

.goal-title {
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
