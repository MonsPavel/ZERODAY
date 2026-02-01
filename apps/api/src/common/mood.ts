import { TaskStatus } from '@prisma/client';

export type Mood = 'GOOD' | 'NEUTRAL' | 'BAD';

const messages: Record<Mood, string[]> = {
  GOOD: [
    'Сделано. Ровно, чисто, уважение.',
    'День закрыт. Ты держишь удар.',
    'Готово. Живи дальше, панк.',
  ],
  NEUTRAL: [
    'Нормально, но не добил. Дожми.',
    'Полпути есть. Остальное — твоя воля.',
    'Есть движ, но финиша нет.',
  ],
  BAD: [
    'Пусто. Либо делай, либо не ной.',
    'Ноль задач — ноль результата. Встань.',
    'Сегодня тишина. Завтра — без отмазок.',
  ],
};

export const pickMoodMessage = (mood: Mood) => {
  const pool = messages[mood];
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getMood = ({
  completed,
  tasks,
}: {
  completed: boolean;
  tasks: { status: TaskStatus }[];
}): Mood => {
  if (completed) {
    return 'GOOD';
  }

  if (tasks.length === 0) {
    return 'BAD';
  }

  const doneCount = tasks.filter((task) => task.status === TaskStatus.DONE).length;
  if (doneCount === 0) {
    return 'BAD';
  }
  if (doneCount < tasks.length) {
    return 'NEUTRAL';
  }
  return 'NEUTRAL';
};
