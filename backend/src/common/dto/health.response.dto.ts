import { ApiProperty } from '@nestjs/swagger';

export enum HealthStatus {
  OK = 'ok',
  ERROR = 'error',
}

export class HealthResponseDto {
  @ApiProperty({ enum: HealthStatus, example: HealthStatus.OK })
  status: HealthStatus;

  @ApiProperty({
    description: 'Service uptime in seconds',
    example: 123.45,
  })
  uptime: number;

  @ApiProperty({
    description: 'Response time of the health check in milliseconds',
    example: 2,
  })
  responseTimeMs: number;

  @ApiProperty({ enum: HealthStatus, example: HealthStatus.OK })
  db: HealthStatus;

  @ApiProperty({
    description: 'Error message if status = error',
    required: false,
    example: 'connection refused',
  })
  error?: string;
}
