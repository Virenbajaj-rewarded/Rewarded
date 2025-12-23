import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StoreType } from '@prisma/client';

export class LocationDto {
  @ApiProperty({ description: 'Full business address' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Latitude coordinate', example: 50.4501 })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 30.5234,
  })
  @IsNumber()
  longitude: number;
}

export class CreateMerchantRequestDto {
  @ApiProperty({ description: 'Business owner full name' })
  @IsString()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({ description: 'Business legal or trading name' })
  @IsString()
  @MaxLength(255)
  businessName: string;

  @ApiProperty({ description: 'Business contact email' })
  @IsString()
  @MaxLength(255)
  email: string;

  @ApiProperty({ description: 'Business phone number' })
  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @ApiProperty({ description: 'Business industry type', enum: StoreType })
  @IsEnum(StoreType)
  industry: StoreType;

  @ApiProperty({ description: 'Business location details' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
