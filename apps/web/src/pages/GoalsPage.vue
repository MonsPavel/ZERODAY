<script setup lang="ts">
import { computed, ref } from 'vue';
import { UiBadge, UiButton, UiCard, UiInput, UiProgress } from '@zeroday/ui';
import {
  useActiveGoalsQuery,
  useCreateGoalMutation,
  useDeleteGoalMutation,
  useToggleGoalMutation,
} from '@/features/goals/queries';
import type { GoalType } from '@/shared/api/types';
import { GOAL_TYPE_MAP } from '@/features/goals/goalType.map';

const goalsQuery = useActiveGoalsQuery();
const createGoalMutation = useCreateGoalMutation();
const toggleGoalMutation = useToggleGoalMutation();
const deleteGoalMutation = useDeleteGoalMutation();

const title = ref('');
const type = ref<GoalType>('COUNT_TASKS_DONE');
const targetInt = ref(7);
const inlineError = ref<string | null>(null);

const goals = computed(() => goalsQuery.data.value ?? []);

const handleCreate = async () => {
  inlineError.value = null;
  const trimmed = title.value.trim();
  if (!trimmed) {
    inlineError.value = 'Введите название цели.';
    return;
  }
  try {
    await createGoalMutation.mutateAsync({
      title: trimmed,
      type: type.value,
      targetInt: targetInt.value,
    });
    title.value = '';
    targetInt.value = 7;
  } catch {
    inlineError.value = 'Не удалось создать цель.';
  }
};

const goalTypeOptions = Object.entries(GOAL_TYPE_MAP).map(([key, value]) => ({
  value: key as GoalType,
  label: value.label,
  hint: value.hint,
}));
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <h2>Goals</h2>
        <p class="muted">Долгосрочные цели и прогресс</p>
      </div>
    </div>

    <UiCard>
      <template #header>New goal</template>
      <form class="stack" @submit.prevent="handleCreate">
        <UiInput v-model="title" placeholder="Название цели" />
        <div class="row">
          <label class="field">
            <span class="label">Тип цели</span>
            <select v-model="type" class="select">
              <option v-for="option in goalTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <span class="hint">{{ GOAL_TYPE_MAP[type].hint }}</span>
          </label>
          <label class="field">
            <span class="label">Target</span>
            <input v-model.number="targetInt" type="number" min="1" max="365" class="select" />
          </label>
        </div>
        <div class="actions">
          <UiButton size="sm" type="submit" :disabled="createGoalMutation.isPending.value">
            {{ createGoalMutation.isPending.value ? 'Saving...' : 'Create goal' }}
          </UiButton>
          <span v-if="inlineError" class="error">{{ inlineError }}</span>
        </div>
      </form>
    </UiCard>

    <UiCard>
      <template #header>Active goals</template>
      <div class="stack">
        <div v-if="goalsQuery.isLoading.value" class="muted">Loading...</div>
        <div v-else-if="goals.length === 0" class="muted">
          Целей нет. Выбери, куда бить.
        </div>
        <div v-else class="list">
          <div v-for="goal in goals" :key="goal.id" class="goal">
            <div class="goal-head">
              <div>
                <div class="goal-title">{{ goal.title }}</div>
                <div class="muted">
                  {{ goal.progressInt }} / {{ goal.targetInt }} {{ GOAL_TYPE_MAP[goal.type].progressUnit }}
                </div>
              </div>
              <UiBadge tone="default">{{ GOAL_TYPE_MAP[goal.type].label }}</UiBadge>
            </div>
            <UiProgress
              :value="Math.min(100, Math.round((goal.progressInt / goal.targetInt) * 100))"
            />
            <div class="actions">
              <UiButton
                size="sm"
                variant="ghost"
                :disabled="toggleGoalMutation.isPending.value"
                @click="toggleGoalMutation.mutate(goal.id)"
              >
                {{ goal.isActive ? 'Archive' : 'Unarchive' }}
              </UiButton>
              <UiButton
                size="sm"
                variant="ghost"
                :disabled="deleteGoalMutation.isPending.value"
                @click="deleteGoalMutation.mutate(goal.id)"
              >
                Delete
              </UiButton>
            </div>
          </div>
        </div>
      </div>
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

.stack {
  display: grid;
  gap: 12px;
}

.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.field {
  display: grid;
  gap: 6px;
  min-width: 180px;
  flex: 1;
}

.label {
  font-size: 12px;
  color: var(--muted);
}

.hint {
  font-size: 12px;
  color: var(--muted);
}

.select {
  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.list {
  display: grid;
  gap: 12px;
}

.goal {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px;
  background: var(--card);
  display: grid;
  gap: 10px;
}

.goal-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.goal-title {
  font-weight: 600;
}

.muted {
  color: var(--muted);
}

.error {
  color: var(--accent);
}
</style>
