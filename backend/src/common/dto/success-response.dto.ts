import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  constructor(success = true) {
    this.success = success;
  }
}
