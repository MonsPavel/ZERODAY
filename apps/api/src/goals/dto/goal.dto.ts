import { ApiProperty } from '@nestjs/swagger';
import { GoalType } from '@prisma/client';

export class GoalDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: GoalType })
  type!: GoalType;

  @ApiProperty()
  targetInt!: number;

  @ApiProperty()
  progressInt!: number;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
