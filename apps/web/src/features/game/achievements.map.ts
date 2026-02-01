export type AchievementCode =
  | 'FIRST_TASK_DONE'
  | 'FIRST_FINISHED_DAY'
  | 'NO_ZERO_3'
  | 'PERFECT_DAY'
  | 'STREAK_7';

export const ACHIEVEMENTS_MAP: Record<
  AchievementCode,
  { title: string; description: string }
> = {
  FIRST_TASK_DONE: {
    title: 'First task done',
    description: 'Complete your first task.',
  },
  FIRST_FINISHED_DAY: {
    title: 'First finished day',
    description: 'Finish all tasks in a day.',
  },
  NO_ZERO_3: {
    title: 'No zero days',
    description: 'Complete at least one task for 3 days in a row.',
  },
  PERFECT_DAY: {
    title: 'Perfect day',
    description: 'Complete all tasks in a single day.',
  },
  STREAK_7: {
    title: 'Streak 7',
    description: 'Reach a 7 day streak.',
  },
};
