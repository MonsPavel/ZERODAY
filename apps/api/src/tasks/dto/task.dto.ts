import { ApiProperty } from '@nestjs/swagger';

export class TaskDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  dayId!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false, nullable: true })
  note?: string | null;

  @ApiProperty({ enum: ['TODO', 'DONE'] })
  status!: 'TODO' | 'DONE';

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
