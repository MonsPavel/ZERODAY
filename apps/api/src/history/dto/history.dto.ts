import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from '../../tasks/dto/task.dto';

export class HistoryDayDto {
  @ApiProperty()
  date!: string;

  @ApiProperty()
  completed!: boolean;

  @ApiProperty()
  doneCount!: number;

  @ApiProperty()
  totalCount!: number;
}

export class HistoryResponseDto {
  @ApiProperty({ type: [HistoryDayDto] })
  days!: HistoryDayDto[];

  @ApiProperty()
  streak!: {
    current: number;
    best: number;
  };
}

export class HistoryDetailDto {
  @ApiProperty()
  date!: string;

  @ApiProperty()
  completed!: boolean;

  @ApiProperty({ type: [TaskDto] })
  tasks!: TaskDto[];
}
