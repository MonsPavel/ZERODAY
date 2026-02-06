import { Body, Controller, Delete, Param, Patch, Post, Get, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalDto } from './dto/goal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('active')
  @ApiOkResponse({ type: [GoalDto] })
  getActive(@Req() req: { user: { id: string } }) {
    return this.goalsService.getActive(req.user.id);
  }

  @Post()
  @ApiCreatedResponse({ type: GoalDto })
  createGoal(@Body() dto: CreateGoalDto, @Req() req: { user: { id: string } }) {
    return this.goalsService.createGoal(dto, req.user.id);
  }

  @Patch(':id/toggle')
  @ApiOkResponse({ type: GoalDto })
  toggleGoal(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { id: string } }) {
    return this.goalsService.toggleGoal(id, req.user.id);
  }

  @Delete(':id')
  @ApiOkResponse({ schema: { example: { ok: true } } })
  deleteGoal(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { id: string } }) {
    return this.goalsService.deleteGoal(id, req.user.id);
  }
}
