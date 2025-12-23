import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdParamDto {
  @ApiProperty({
    description: 'Entity unique identifier (UUID)',
    example: '7e4a98c3-ccfa-41b8-b6d4-314799c6b7f1',
  })
  @IsUUID()
  id: string;
}
