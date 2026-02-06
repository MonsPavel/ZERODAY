import { BadRequestException, Injectable } from '@nestjs/common';
import { GoalType, Prisma, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { getLocalDateString } from '../common/date';
import { GoalsService } from '../goals/goals.service';

type Mood = 'GOOD' | 'NEUTRAL' | 'BAD';
type TimeOfDay = 'MORNING' | 'DAY' | 'EVENING';

const ACHIEVEMENTS_CATALOG = [
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

const messagePool: Record<TimeOfDay, Record<Mood, string[]>> = {
  MORNING: {
    GOOD: ['Утро с победой. Держи темп.', 'С утра закрыто. Хороший знак.', 'Чисто. Начал бодро.'],
    NEUTRAL: ['Утро есть, финиша нет. Дожми.', 'Старт норм, но не тормози.', 'Есть движ — нужен финал.'],
    BAD: ['Пока пусто. Просыпайся.', 'Ноль задач — ноль утра.', 'Соберись, панк.'],
  },
  DAY: {
    GOOD: ['День закрыт. Ровно.', 'Середина дня, а ты уже сделал.', 'Готово. Респект.'],
    NEUTRAL: ['День идёт, но не закрыт.', 'Прогресс есть, финиша нет.', 'Дожимай, пока есть свет.'],
    BAD: ['Днём молчание? Жёстко.', 'Ноль задач — ноль движений.', 'Подними план, иначе день сгорит.'],
  },
  EVENING: {
    GOOD: ['Вечер закрыт. Спокойно.', 'Финиш под вечер — тоже финиш.', 'Закрыл день. Живи дальше.'],
    NEUTRAL: ['Вечер, а хвосты висят.', 'Есть шаги, но без точки.', 'Добей и спи.'],
    BAD: ['Вечер пустой. Не катит.', 'Ноль дел — ноль смысла.', 'Соберись. Завтра не железный.'],
  },
};

const tipsPool: Record<Mood, string[]> = {
  GOOD: ['Держи ритм завтра.', 'Сделай одну мелочь заранее.'],
  NEUTRAL: ['Добавь 1 микро-задачу.', 'Закрой одну TODO прямо сейчас.'],
  BAD: ['Сделай 5‑минутный шаг.', 'Запиши одну задачу и начни.'],
};

const pickRandom = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const pickTips = (mood: Mood) => {
  if (mood === 'GOOD') {
    return Math.random() > 0.5 ? [pickRandom(tipsPool.GOOD)] : [];
  }
  if (mood === 'NEUTRAL') {
    return [pickRandom(tipsPool.NEUTRAL)];
  }
  return tipsPool.BAD.slice(0, 2);
};

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 11) {
    return 'MORNING';
  }
  if (hour >= 12 && hour <= 17) {
    return 'DAY';
  }
  return 'EVENING';
};

const getMood = (completed: boolean, tasks: { status: TaskStatus }[]): Mood => {
  if (completed) {
    return 'GOOD';
  }
  const doneCount = tasks.filter((task) => task.status === TaskStatus.DONE).length;
  if (tasks.length === 0 || doneCount === 0) {
    return 'BAD';
  }
  return 'NEUTRAL';
};

const isYesterday = (candidate: string, today: string) => {
  const [y, m, d] = candidate.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const todayDate = new Date(ty, tm - 1, td);
  const diff = todayDate.getTime() - date.getTime();
  return diff === 24 * 60 * 60 * 1000;
};

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly goalsService: GoalsService,
  ) {}

  private async ensureStreak(tx: Prisma.TransactionClient, userId: string) {
    await tx.streak.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        currentInt: 0,
        bestInt: 0,
      },
    });
  }

  private async ensureAchievementsCatalog(tx: Prisma.TransactionClient) {
    await Promise.all(
      ACHIEVEMENTS_CATALOG.map((achievement) =>
        tx.achievement.upsert({
          where: { code: achievement.code },
          update: {},
          create: achievement,
        }),
      ),
    );
  }

  private async getToday(tx: Prisma.TransactionClient, userId: string) {
    const date = getLocalDateString();
    const day = await tx.day.findFirst({
      where: {
        userId,
        date,
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (day) {
      return day;
    }

    return tx.day.create({
      data: {
        userId,
        date,
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  async getOrCreateToday(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      return this.getToday(tx, userId);
    });
  }

  private async grantAchievements(tx: Prisma.TransactionClient, userId: string, streakCurrent: number) {
    const achievements = await tx.achievement.findMany({
      where: {
        code: {
          in: ACHIEVEMENTS_CATALOG.map((entry) => entry.code),
        },
      },
    });

    const byCode = new Map(achievements.map((entry) => [entry.code, entry]));
    const grant = async (code: string) => {
      const achievement = byCode.get(code);
      if (!achievement) {
        return;
      }
      await tx.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
        update: {},
        create: {
          userId,
          achievementId: achievement.id,
        },
      });
    };

    await grant('PERFECT_DAY');

    const finishedDayCount = await tx.day.count({
      where: { userId, completed: true },
    });
    if (finishedDayCount >= 1) {
      await grant('FIRST_FINISHED_DAY');
    }

    const doneTaskCount = await tx.task.count({
      where: { userId, status: TaskStatus.DONE },
    });
    if (doneTaskCount >= 1) {
      await grant('FIRST_TASK_DONE');
    }

    if (streakCurrent >= 3) {
      await grant('NO_ZERO_3');
    }
    if (streakCurrent >= 7) {
      await grant('STREAK_7');
    }
  }

  private async buildGameState(tx: Prisma.TransactionClient, userId: string) {
    const day = await this.getToday(tx, userId);
    const streak = await tx.streak.findUnique({
      where: { userId },
    });
    const goals = await tx.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    const achievements = await tx.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'asc' },
    });

    const mood = getMood(day.completed, day.tasks);
    const timeOfDay = getTimeOfDay();
    const message = pickRandom(messagePool[timeOfDay][mood]);
    const tips = pickTips(mood);

    const today = getLocalDateString();
    const completedTodayCount = goals.filter((goal) => {
      if (goal.isActive) {
        return false;
      }
      if (goal.progressInt < goal.targetInt) {
        return false;
      }
      const formatted = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(goal.updatedAt);
      return formatted === today;
    }).length;

    const activeGoals = goals.filter((goal) => goal.isActive);
    const topGoal =
      activeGoals.length === 0
        ? null
        : activeGoals
            .slice()
            .sort((a, b) => b.progressInt / b.targetInt - a.progressInt / a.targetInt)[0];

    return {
      date: day.date,
      timeOfDay,
      mood,
      message,
      tips,
      streak: {
        current: streak?.currentInt ?? 0,
        best: streak?.bestInt ?? 0,
      },
      goalsSummary: {
        activeCount: activeGoals.length,
        completedTodayCount,
        topGoal: topGoal
          ? {
              title: topGoal.title,
              type: topGoal.type,
              progressInt: topGoal.progressInt,
              targetInt: topGoal.targetInt,
            }
          : null,
      },
      achievements: achievements.map((item) => ({
        code: item.achievement.code,
        title: item.achievement.title,
        description: item.achievement.description,
        unlockedAt: item.unlockedAt.toISOString(),
      })),
    };
  }

  async computeTodayState(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await this.ensureStreak(tx, userId);
      await this.ensureAchievementsCatalog(tx);
      return this.buildGameState(tx, userId);
    });
  }

  async applyFinishDay(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await this.ensureStreak(tx, userId);
      await this.ensureAchievementsCatalog(tx);

      const today = getLocalDateString();
      let day = await this.getToday(tx, userId);

      if (day.tasks.length === 0) {
        throw new BadRequestException({
          code: 'NO_TASKS',
          message: 'Ноль задач. День ещё не начался.',
        });
      }

      const doneCount = day.tasks.filter((task) => task.status === TaskStatus.DONE).length;
      if (doneCount < day.tasks.length) {
        throw new BadRequestException({
          code: 'NOT_ALL_DONE',
          message: 'Хвосты остались. Добей их.',
        });
      }

      const wasCompleted = day.completed;
      if (!wasCompleted) {
        day = await tx.day.update({
          where: { id: day.id },
          data: { completed: true },
          include: { tasks: { orderBy: { createdAt: 'asc' } } },
        });

        const previous = await tx.day.findFirst({
          where: { userId, completed: true, date: { lt: today } },
          orderBy: { date: 'desc' },
        });

        const streak = await tx.streak.findUnique({ where: { userId } });
        const nextCurrent =
          previous && isYesterday(previous.date, today) ? (streak?.currentInt ?? 0) + 1 : 1;
        const nextBest = Math.max(streak?.bestInt ?? 0, nextCurrent);

        await tx.streak.update({
          where: { userId },
          data: {
            currentInt: nextCurrent,
            bestInt: nextBest,
          },
        });

        await this.goalsService.incrementGoals(userId, GoalType.FINISH_DAYS, tx);
        await this.grantAchievements(tx, userId, nextCurrent);
      }

      const state = await this.buildGameState(tx, userId);
      return { ok: true, ...state };
    });
  }
}
