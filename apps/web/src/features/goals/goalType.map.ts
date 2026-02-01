import type { GoalType } from '@/shared/api/types';

export const GOAL_TYPE_MAP: Record<
  GoalType,
  { label: string; hint: string; progressUnit: 'DONE' | 'дни' }
> = {
  COUNT_TASKS_DONE: {
    label: 'Задачи закрывать',
    hint: 'Сколько задач довести до DONE.',
    progressUnit: 'DONE',
  },
  FINISH_DAYS: {
    label: 'Дни закрывать',
    hint: 'Сколько дней подряд/в сумме закрыть.',
    progressUnit: 'дни',
  },
};
