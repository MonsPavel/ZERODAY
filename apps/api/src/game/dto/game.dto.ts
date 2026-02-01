import { ApiProperty } from '@nestjs/swagger';

export class GameStateDto {
  @ApiProperty()
  date!: string;

  @ApiProperty({ enum: ['MORNING', 'DAY', 'EVENING'] })
  timeOfDay!: 'MORNING' | 'DAY' | 'EVENING';

  @ApiProperty({ enum: ['GOOD', 'NEUTRAL', 'BAD'] })
  mood!: 'GOOD' | 'NEUTRAL' | 'BAD';

  @ApiProperty()
  message!: string;

  @ApiProperty({ type: [String] })
  tips!: string[];

  @ApiProperty()
  streak!: {
    current: number;
    best: number;
  };

  @ApiProperty({
    type: {
      properties: {
        activeCount: { type: 'number' },
        completedTodayCount: { type: 'number', nullable: true },
        topGoal: {
          type: 'object',
          nullable: true,
          properties: {
            title: { type: 'string' },
            type: { type: 'string' },
            progressInt: { type: 'number' },
            targetInt: { type: 'number' },
          },
        },
      },
    },
  })
  goalsSummary!: {
    activeCount: number;
    completedTodayCount?: number;
    topGoal?: { title: string; type: string; progressInt: number; targetInt: number } | null;
  };

  @ApiProperty({ type: () => [AchievementDto] })
  achievements!: AchievementDto[];
}

export class FinishDayResponseDto extends GameStateDto {
  @ApiProperty()
  ok!: boolean;
}

export class AchievementDto {
  @ApiProperty()
  code!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  unlockedAt!: string;
}
