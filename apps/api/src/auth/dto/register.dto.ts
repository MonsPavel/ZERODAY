import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 6, maxLength: 72 })
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password!: string;
}
