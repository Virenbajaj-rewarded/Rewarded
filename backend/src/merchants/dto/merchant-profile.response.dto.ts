import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../users/types/user-role.enum';
import { BaseMerchantDto } from '../../common/dto/base-merchant.dto';

export class MerchantUserDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty({ enum: UserRole }) role: UserRole;
}

export class MerchantProfileResponseDto extends BaseMerchantDto {
  @ApiPropertyOptional({ type: MerchantUserDto }) user?: MerchantUserDto;
}
