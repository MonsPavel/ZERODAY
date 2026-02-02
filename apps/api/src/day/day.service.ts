import { BadRequestException, Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { getLocalDateString } from '../common/date';
import { DEMO_USER_ID } from '../common/constants';
import { getMood, pickMoodMessage } from '../common/mood';

@Injectable()
export class DayService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureDemoUser() {
    await this.prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      update: {},
      create: { id: DEMO_USER_ID },
    });
  }

  async getOrCreateToday() {
    await this.ensureDemoUser();
    const date = getLocalDateString();
    const day = await this.prisma.day.findFirst({
      where: {
        userId: DEMO_USER_ID,
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

    return this.prisma.day.create({
      data: {
        userId: DEMO_USER_ID,
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

  async finishToday() {
    await this.ensureDemoUser();
    const date = getLocalDateString();
    const day = await this.prisma.day.findFirst({
      where: {
        userId: DEMO_USER_ID,
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

    const existingDay =
      day ??
      (await this.prisma.day.create({
        data: {
          userId: DEMO_USER_ID,
          date,
        },
        include: {
          tasks: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      }));

    if (existingDay.tasks.length === 0) {
      throw new BadRequestException({
        code: 'NO_TASKS',
        message: 'Нет задач на сегодня.',
      });
    }

    const doneCount = existingDay.tasks.filter((task) => task.status === TaskStatus.DONE).length;
    if (doneCount < existingDay.tasks.length) {
      throw new BadRequestException({
        code: 'NOT_ALL_DONE',
        message: 'Не все задачи выполнены.',
      });
    }

    const updatedDay = existingDay.completed
      ? existingDay
      : await this.prisma.day.update({
          where: { id: existingDay.id },
          data: { completed: true },
          include: {
            tasks: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        });

    const mood = getMood({ completed: updatedDay.completed, tasks: updatedDay.tasks });
    const message = pickMoodMessage(mood);

    return {
      ok: true,
      date: updatedDay.date,
      completed: updatedDay.completed,
      mood,
      message,
    };
  }

  async getMood() {
    const day = await this.getOrCreateToday();
    const mood = getMood({ completed: day.completed, tasks: day.tasks });
    return {
      mood,
      message: pickMoodMessage(mood),
    };
  }
}
