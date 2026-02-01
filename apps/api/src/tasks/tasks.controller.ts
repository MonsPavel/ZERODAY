import { Body, Controller, Delete, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskDto } from './dto/task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiCreatedResponse({ type: TaskDto })
  @ApiBadRequestResponse({ schema: { example: { code: 'BAD_REQUEST', message: 'Validation failed' } } })
  createTask(@Body() body: CreateTaskDto) {
    return this.tasksService.createTask(body);
  }

  @Patch(':id/toggle')
  @ApiOkResponse({ type: TaskDto })
  @ApiNotFoundResponse({ schema: { example: { code: 'NOT_FOUND', message: 'Task not found.' } } })
  toggleTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.toggleTask(id);
  }

  @Delete(':id')
  @ApiOkResponse({ schema: { example: { ok: true } } })
  @ApiNotFoundResponse({ schema: { example: { code: 'NOT_FOUND', message: 'Task not found.' } } })
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
