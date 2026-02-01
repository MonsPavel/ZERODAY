import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty()
  code!: 'NO_TASKS' | 'NOT_ALL_DONE' | 'NOT_FOUND';

  @ApiProperty()
  message!: string;
}
