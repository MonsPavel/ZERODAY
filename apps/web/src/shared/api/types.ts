export type TaskStatus = 'TODO' | 'DONE';
export type TimeOfDay = 'MORNING' | 'DAY' | 'EVENING';
export type Mood = 'GOOD' | 'NEUTRAL' | 'BAD';

export type Task = {
  id: number;
  title: string;
  note?: string | null;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type DayToday = {
  date: string;
  completed: boolean;
  tasks: Task[];
};

export type FinishDayOk = GameState & {
  ok: boolean;
};

export type ApiError = {
  code: 'NO_TASKS' | 'NOT_ALL_DONE' | 'NOT_FOUND' | 'UNKNOWN';
  message: string;
};

export type Streak = {
  current: number;
  best: number;
};

export type AchievementUnlocked = {
  code: string;
  title: string;
  description: string;
  unlockedAt: string;
};

export type GameState = {
  date: string;
  timeOfDay: TimeOfDay;
  mood: Mood;
  message: string;
  tips: string[];
  streak: Streak;
  goalsSummary: GoalsSummary;
  achievements: AchievementUnlocked[];
};

export type HistoryDaySummary = {
  date: string;
  completed: boolean;
  doneCount: number;
  totalCount: number;
};

export type HistoryResponse = {
  days: HistoryDaySummary[];
  streak: Streak;
};

export type HistoryDayDetail = {
  date: string;
  completed: boolean;
  tasks: Task[];
};

export type GoalType = 'COUNT_TASKS_DONE' | 'FINISH_DAYS';

export type Goal = {
  id: number;
  userId: number;
  title: string;
  type: GoalType;
  targetInt: number;
  progressInt: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GoalsSummary = {
  activeCount: number;
  completedTodayCount?: number;
  topGoal?: { title: string; type: GoalType; progressInt: number; targetInt: number } | null;
};
