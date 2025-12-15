// health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './indicators/database.indicator';
import { RedisHealthIndicator } from './indicators/redis.indicator';
import { RabbitMQHealthIndicator } from './indicators/rabbitmq.indicator';
import { QueueHealthIndicator } from './indicators/queue.indicator';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: DatabaseHealthIndicator,
        private redis: RedisHealthIndicator,
        private rabbitmq: RabbitMQHealthIndicator,
        private queue: QueueHealthIndicator,
    ) { }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.db.isHealthy('database'),
            () => this.redis.isHealthy('redis'),
            () => this.rabbitmq.isHealthy('rabbitmq'),
            () => this.queue.isHealthy('queue'),
        ]);
    }

    @Get('readiness')
    @HealthCheck()
    readiness() {
        return this.health.check([
            () => this.db.isHealthy('database'),
            () => this.redis.isHealthy('redis'),
        ]);
    }

    @Get('liveness')
    liveness() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
}