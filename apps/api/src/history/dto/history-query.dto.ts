import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';

export class HistoryQueryDto {
  @Transform(({ value }) => Number(value))
  @IsIn([7, 14, 30])
  days!: number;
}
