import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ description: 'Latitude coordinate', example: 50.4501 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate', example: 30.5234 })
  @IsNumber()
  longitude: number;
}
