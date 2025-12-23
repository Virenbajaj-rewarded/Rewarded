import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../types/user-role.enum';

export class UserProfileResponseDto {
  @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
  id: string;

  @ApiProperty({ example: 'John Doe', nullable: true })
  fullName: string | null;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '+380501234567', nullable: true })
  phone: string | null;

  @ApiProperty({ example: true })
  isEmailConfirmed: boolean;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
