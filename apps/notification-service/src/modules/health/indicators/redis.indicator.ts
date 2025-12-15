// indicators/redis.indicator.ts
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { RedisCacheAdapter } from '../../notification/infrastructure/cache/redis-cache.adapter';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    constructor(private readonly redis: RedisCacheAdapter) {
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            const client = this.redis.getClient();
            await client.ping();
            return this.getStatus(key, true);
        } catch (error) {
            throw new HealthCheckError('Redis check failed', this.getStatus(key, false));
        }
    }
}