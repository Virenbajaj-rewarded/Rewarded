import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { StoreType } from '@prisma/client';
import { Type } from 'class-transformer';
import { LocationDto } from './create-merchant.request.dto';

export class UpdateMerchantRequestDto {
  @ApiProperty({ example: 'My New Business' })
  @IsString()
  @MaxLength(255)
  businessName: string;

  @ApiProperty({ example: 'owner@business.com' })
  @IsEmail()
  @MaxLength(255)
  businessEmail: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @MaxLength(20)
  businessPhoneNumber: string;

  @ApiProperty({ description: 'Business location details' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({ enum: StoreType, default: StoreType.ACCOUNTING_BOOKKEEPING })
  @IsEnum(StoreType)
  storeType: StoreType;

  @ApiPropertyOptional({ example: 'We specialize in premium services.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'my_tg_username' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tgUsername?: string;

  @ApiPropertyOptional({ example: 'my_whatsapp_username' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  whatsppUsername?: string;
}
