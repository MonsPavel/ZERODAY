import { Controller, Get, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DayService } from './day.service';
import { DayTodayResponseDto, FinishDayResponseDto, MoodResponseDto } from './dto/day.dto';
import { ErrorResponseDto } from './dto/error.dto';

@ApiTags('day')
@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @Get('today')
  @ApiOkResponse({ type: DayTodayResponseDto })
  async getToday() {
    const day = await this.dayService.getOrCreateToday();
    return {
      date: day.date,
      completed: day.completed,
      tasks: day.tasks,
    };
  }

  @Post('finish')
  @ApiOkResponse({ type: FinishDayResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation of day completion',
    type: ErrorResponseDto,
    examples: {
      noTasks: {
        summary: 'No tasks for today',
        value: { code: 'NO_TASKS', message: 'Нет задач на сегодня.' },
      },
      notAllDone: {
        summary: 'Not all tasks completed',
        value: { code: 'NOT_ALL_DONE', message: 'Не все задачи выполнены.' },
      },
    },
  })
  async finishDay() {
    return this.dayService.finishToday();
  }

  @Get('mood')
  @ApiOkResponse({ type: MoodResponseDto })
  async getMood() {
    return this.dayService.getMood();
  }
}
