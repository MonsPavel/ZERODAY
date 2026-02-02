import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { DayController } from './day/day.controller';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { GameService } from './game/game.service';
import { GameController } from './game/game.controller';
import { HistoryController } from './history/history.controller';
import { HistoryService } from './history/history.service';
import { GoalsController } from './goals/goals.controller';
import { GoalsService } from './goals/goals.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    AppController,
    DayController,
    TasksController,
    GameController,
    HistoryController,
    GoalsController,
  ],
  providers: [TasksService, GameService, HistoryService, GoalsService],
})
export class AppModule {}
