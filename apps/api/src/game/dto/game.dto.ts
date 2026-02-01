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
