import { Body, Controller, Delete, Param, Patch, Post, Get, ParseIntPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalDto } from './dto/goal.dto';

@ApiTags('goals')
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('active')
  @ApiOkResponse({ type: [GoalDto] })
  getActive() {
    return this.goalsService.getActive();
  }

  @Post()
  @ApiCreatedResponse({ type: GoalDto })
  createGoal(@Body() dto: CreateGoalDto) {
    return this.goalsService.createGoal(dto);
  }

  @Patch(':id/toggle')
  @ApiOkResponse({ type: GoalDto })
  toggleGoal(@Param('id', ParseIntPipe) id: number) {
    return this.goalsService.toggleGoal(id);
  }

  @Delete(':id')
  @ApiOkResponse({ schema: { example: { ok: true } } })
  deleteGoal(@Param('id', ParseIntPipe) id: number) {
    return this.goalsService.deleteGoal(id);
  }
}
