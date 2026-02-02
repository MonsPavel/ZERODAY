import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from '../../tasks/dto/task.dto';

export class DayTodayResponseDto {
  @ApiProperty()
  date!: string;

  @ApiProperty()
  completed!: boolean;

  @ApiProperty({ type: [TaskDto] })
  tasks!: TaskDto[];
}

export class FinishDayResponseDto {
  @ApiProperty()
  ok!: boolean;

  @ApiProperty()
  date!: string;

  @ApiProperty()
  completed!: boolean;

  @ApiProperty({ enum: ['GOOD', 'NEUTRAL', 'BAD'] })
  mood!: 'GOOD' | 'NEUTRAL' | 'BAD';

  @ApiProperty()
  message!: string;
}

export class MoodResponseDto {
  @ApiProperty({ enum: ['GOOD', 'NEUTRAL', 'BAD'] })
  mood!: 'GOOD' | 'NEUTRAL' | 'BAD';

  @ApiProperty()
  message!: string;
}
