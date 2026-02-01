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

export type FinishDayOk = {
  ok: boolean;
  date: string;
  completed: boolean;
  mood: Mood;
  message: string;
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
