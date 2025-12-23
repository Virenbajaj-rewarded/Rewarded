import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Old123!' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'New123!' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
