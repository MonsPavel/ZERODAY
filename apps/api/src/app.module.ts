import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { DayController } from './day/day.controller';
import { DayService } from './day/day.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, DayController, TasksController],
  providers: [DayService, TasksService],
})
export class AppModule {}
