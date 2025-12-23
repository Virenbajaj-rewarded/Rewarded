import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class RegisterUserBodyDto {
  @ApiPropertyOptional({
    description: 'Full name of the user (optional)',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the user (optional)',
    example: '+421911234567',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{6,15}$/, {
    message:
      'phoneNumber must contain only digits and may start with a plus sign (+)',
  })
  phoneNumber?: string;
}
