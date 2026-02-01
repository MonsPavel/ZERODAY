import { Controller, Get, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GameService } from '../game/game.service';
import { DayTodayResponseDto, MoodResponseDto } from './dto/day.dto';
import { ErrorResponseDto } from './dto/error.dto';
import { FinishDayResponseDto } from '../game/dto/game.dto';

@ApiTags('day')
@Controller('day')
export class DayController {
  constructor(private readonly gameService: GameService) {}

  @Get('today')
  @ApiOkResponse({ type: DayTodayResponseDto })
  async getToday() {
    const day = await this.gameService.getOrCreateToday();
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
    return this.gameService.applyFinishDay();
  }

  @Get('mood')
  @ApiOkResponse({ type: MoodResponseDto })
  async getMood() {
    const state = await this.gameService.computeTodayState();
    return {
      mood: state.mood,
      message: state.message,
    };
  }
}
