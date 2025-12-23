import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../types/user-role.enum';

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '3f12a4b6-9c1d-4d5a-bc99-1d7a3f9e7a2b',
  })
  id: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+380963232323',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Is user email confirmed',
    example: false,
  })
  isEmailConfirmed: boolean;
}
