import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { DayController } from './day/day.controller';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { GameService } from './game/game.service';
import { GameController } from './game/game.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, DayController, TasksController, GameController],
  providers: [TasksService, GameService],
})
export class AppModule {}
