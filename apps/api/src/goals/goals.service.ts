import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActive(userId: string) {
    return this.prisma.goal.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createGoal(dto: CreateGoalDto, userId: string) {
    return this.prisma.goal.create({
      data: {
        userId,
        title: dto.title,
        type: dto.type,
        targetInt: dto.targetInt,
      },
    });
  }

  async toggleGoal(id: number, userId: string) {
    const goal = await this.prisma.goal.findUnique({ where: { id } });
    if (!goal || goal.userId !== userId) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Goal not found.' });
    }
    return this.prisma.goal.update({
      where: { id },
      data: { isActive: !goal.isActive },
    });
  }

  async deleteGoal(id: number, userId: string) {
    const goal = await this.prisma.goal.findUnique({ where: { id } });
    if (!goal || goal.userId !== userId) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Goal not found.' });
    }
    await this.prisma.goal.delete({ where: { id } });
    return { ok: true };
  }

  async incrementGoals(userId: string, type: GoalType, tx?: Prisma.TransactionClient) {
    const client = (tx ?? this.prisma) as Prisma.TransactionClient;
    const goals = await client.goal.findMany({
      where: { userId, isActive: true, type },
    });

    await Promise.all(
      goals.map((goal) =>
        client.goal.update({
          where: { id: goal.id },
          data: {
            progressInt: goal.progressInt + 1,
            isActive: goal.progressInt + 1 >= goal.targetInt ? false : goal.isActive,
          },
        }),
      ),
    );
  }
}
