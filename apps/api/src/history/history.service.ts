import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getLocalDateString } from '../common/date';

const toDateString = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
};

const buildRange = (days: number) => {
  const today = getLocalDateString();
  const [y, m, d] = today.split('-').map(Number);
  const base = new Date(y, m - 1, d);
  return Array.from({ length: days }, (_, index) => {
    const dt = new Date(base);
    dt.setDate(base.getDate() - index);
    return toDateString(dt);
  });
};

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureStreak(userId: string) {
    await this.prisma.streak.upsert({
      where: { userId },
      update: {},
      create: { userId, currentInt: 0, bestInt: 0 },
    });
  }

  async getHistory(userId: string, days: number) {
    await this.ensureStreak(userId);

    const range = buildRange(days);
    const dayRecords = await this.prisma.day.findMany({
      where: {
        userId,
        date: { in: range },
      },
      include: {
        tasks: true,
      },
    });

    const dayMap = new Map(dayRecords.map((day) => [day.date, day]));
    const streak = await this.prisma.streak.findUnique({
      where: { userId },
    });

    const daysPayload = range.map((date) => {
      const day = dayMap.get(date);
      if (!day) {
        return {
          date,
          completed: false,
          doneCount: 0,
          totalCount: 0,
        };
      }
      const doneCount = day.tasks.filter((task) => task.status === 'DONE').length;
      return {
        date,
        completed: day.completed,
        doneCount,
        totalCount: day.tasks.length,
      };
    });

    return {
      days: daysPayload,
      streak: {
        current: streak?.currentInt ?? 0,
        best: streak?.bestInt ?? 0,
      },
    };
  }

  async getDayDetails(userId: string, date: string) {
    const day = await this.prisma.day.findFirst({
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

    if (!day) {
      return {
        date,
        completed: false,
        tasks: [],
      };
    }

    return {
      date: day.date,
      completed: day.completed,
      tasks: day.tasks,
    };
  }
}
