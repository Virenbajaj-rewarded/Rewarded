import { ApiProperty } from '@nestjs/swagger';
import { UserProfileResponseDto } from './user-profile.response.dto';

export class UserProfileWithBalancesDto extends UserProfileResponseDto {
  @ApiProperty()
  balance: number;
}
