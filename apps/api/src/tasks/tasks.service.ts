import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { getLocalDateString } from '../common/date';
import { DEMO_USER_ID } from '../common/constants';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(dto: CreateTaskDto) {
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

    const nextStatus = task.status === TaskStatus.TODO ? TaskStatus.DONE : TaskStatus.TODO;

    return this.prisma.task.update({
      where: { id: task.id },
      data: { status: nextStatus },
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
