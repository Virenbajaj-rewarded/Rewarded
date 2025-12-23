import { Injectable } from '@nestjs/common';
import {
  HealthResponseDto,
  HealthStatus,
} from '../common/dto/health.response.dto';
import { PrismaService } from '../common/modules/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<HealthResponseDto> {
    const start = Date.now();

    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');

      return {
        status: HealthStatus.OK,
        uptime: process.uptime(),
        responseTimeMs: Date.now() - start,
        db: HealthStatus.OK,
      };
    } catch (error) {
      return {
        status: HealthStatus.ERROR,
        uptime: process.uptime(),
        responseTimeMs: Date.now() - start,
        db: HealthStatus.ERROR,
        error: error.message,
      };
    }
  }
}
