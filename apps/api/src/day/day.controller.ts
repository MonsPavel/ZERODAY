import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GameService } from '../game/game.service';
import { DayTodayResponseDto, MoodResponseDto } from './dto/day.dto';
import { ErrorResponseDto } from './dto/error.dto';
import { FinishDayResponseDto } from '../game/dto/game.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('day')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('day')
export class DayController {
  constructor(private readonly gameService: GameService) {}

  @Get('today')
  @ApiOkResponse({ type: DayTodayResponseDto })
  async getToday(@Req() req: { user: { id: string } }) {
    const day = await this.gameService.getOrCreateToday(req.user.id);
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
        value: { code: 'NO_TASKS', message: 'Ноль задач. День ещё не начался.' },
      },
      notAllDone: {
        summary: 'Not all tasks completed',
        value: { code: 'NOT_ALL_DONE', message: 'Хвосты остались. Добей их.' },
      },
    },
  })
  async finishDay(@Req() req: { user: { id: string } }) {
    return this.gameService.applyFinishDay(req.user.id);
  }

  @Get('mood')
  @ApiOkResponse({ type: MoodResponseDto })
  async getMood(@Req() req: { user: { id: string } }) {
    const state = await this.gameService.computeTodayState(req.user.id);
    return {
      mood: state.mood,
      message: state.message,
    };
  }
}
