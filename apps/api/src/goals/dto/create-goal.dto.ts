import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GoalType } from '@prisma/client';

export class CreateGoalDto {
  @ApiProperty({ minLength: 1, maxLength: 80 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  title!: string;

  @ApiProperty({ enum: GoalType })
  @IsEnum(GoalType)
  type!: GoalType;

  @ApiProperty({ minimum: 1, maximum: 365 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(365)
  targetInt!: number;
}
