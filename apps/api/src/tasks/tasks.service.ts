import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GoalType, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { getLocalDateString } from '../common/date';
import { GoalsService } from '../goals/goals.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly goalsService: GoalsService,
  ) {}

  async createTask(dto: CreateTaskDto, userId: string) {
    const date = getLocalDateString();
    const day = await this.prisma.day.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {},
      create: {
        userId,
        date,
      },
    });

    return this.prisma.task.create({
      data: {
        userId,
        dayId: day.id,
        title: dto.title,
        note: dto.note,
      },
    });
  }

  async toggleTask(id: number, userId: string) {
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

      if (task.userId !== userId) {
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
        await this.goalsService.incrementGoals(userId, GoalType.COUNT_TASKS_DONE, tx);
      }

      return updated;
    });
  }

  async deleteTask(id: number, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Task not found.',
      });
    }

    if (task.userId !== userId) {
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
