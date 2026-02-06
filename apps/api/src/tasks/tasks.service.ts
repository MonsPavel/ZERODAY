import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GoalType, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { getLocalDateString } from '../common/date';
import { DEMO_USER_EMAIL, DEMO_USER_ID, DEMO_USER_PASSWORD_HASH } from '../common/constants';
import { GoalsService } from '../goals/goals.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly goalsService: GoalsService,
  ) {}

  private async ensureDemoUser() {
    await this.prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      update: {},
      create: {
        id: DEMO_USER_ID,
        email: DEMO_USER_EMAIL,
        passwordHash: DEMO_USER_PASSWORD_HASH,
      },
    });
  }

  async createTask(dto: CreateTaskDto) {
    await this.ensureDemoUser();
    const date = getLocalDateString();
    const day = await this.prisma.day.upsert({
      where: {
        userId_date: {
          userId: DEMO_USER_ID,
          date,
        },
      },
      update: {},
      create: {
        userId: DEMO_USER_ID,
        date,
      },
    });

    return this.prisma.task.create({
      data: {
        userId: DEMO_USER_ID,
        dayId: day.id,
        title: dto.title,
        note: dto.note,
      },
    });
  }

  async toggleTask(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: { id },
      });

      if (!task) {
        throw new NotFoundException({
          code: 'NOT_FOUND',
          message: 'Task not found.',
        });
      }

      if (task.userId !== DEMO_USER_ID) {
        throw new ForbiddenException({
          code: 'NOT_FOUND',
          message: 'Task not found.',
        });
      }

      const nextStatus = task.status === TaskStatus.TODO ? TaskStatus.DONE : TaskStatus.TODO;

      const updated = await tx.task.update({
        where: { id: task.id },
        data: { status: nextStatus },
      });

      if (task.status === TaskStatus.TODO && nextStatus === TaskStatus.DONE) {
        await this.goalsService.incrementGoals(GoalType.COUNT_TASKS_DONE, tx);
      }

      return updated;
    });
  }

  async deleteTask(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Task not found.',
      });
    }

    if (task.userId !== DEMO_USER_ID) {
      throw new ForbiddenException({
        code: 'NOT_FOUND',
        message: 'Task not found.',
      });
    }

    await this.prisma.task.delete({
      where: { id: task.id },
    });

    return { ok: true };
  }
}
