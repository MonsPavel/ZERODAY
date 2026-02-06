import { Body, Controller, Delete, Param, Patch, Post, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiCreatedResponse({ type: TaskDto })
  @ApiBadRequestResponse({ schema: { example: { code: 'BAD_REQUEST', message: 'Validation failed' } } })
  createTask(@Body() body: CreateTaskDto, @Req() req: { user: { id: string } }) {
    return this.tasksService.createTask(body, req.user.id);
  }

  @Patch(':id/toggle')
  @ApiOkResponse({ type: TaskDto })
  @ApiNotFoundResponse({ schema: { example: { code: 'NOT_FOUND', message: 'Task not found.' } } })
  toggleTask(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { id: string } }) {
    return this.tasksService.toggleTask(id, req.user.id);
  }

  @Delete(':id')
  @ApiOkResponse({ schema: { example: { ok: true } } })
  @ApiNotFoundResponse({ schema: { example: { code: 'NOT_FOUND', message: 'Task not found.' } } })
  deleteTask(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { id: string } }) {
    return this.tasksService.deleteTask(id, req.user.id);
  }
}
