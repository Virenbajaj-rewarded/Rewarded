import { IsEmail, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address associated with the user account',
  })
  @IsEmail()
  email: string;
}

export class ForgotPasswordVerifyDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email for which the verification code was requested',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit verification code sent to the user email',
  })
  @IsString()
  code: string;
}

export class ForgotPasswordResetDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email associated with the account',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit verification code received by user',
  })
  @IsString()
  @Length(6)
  code: string;

  @ApiProperty({
    example: 'newSuperSecurePassword123',
    description: 'New password that will replace the old one',
  })
  @MinLength(6)
  newPassword: string;
}
