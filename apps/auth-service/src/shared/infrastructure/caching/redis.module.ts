// Update: apps/auth-service/src/shared/infrastructure/caching/redis.module.ts

import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { getRedisConfig } from '../config/redis.config';
import { CacheService } from './cache.service';

export const REDIS_CLIENT = 'REDIS_CLIENT';

const redisProvider: Provider = {
    provide: REDIS_CLIENT,
    useFactory: (configService: ConfigService) => {
        return new Redis(getRedisConfig(configService));
    },
    inject: [ConfigService],
};

@Global()
@Module({
    providers: [redisProvider, CacheService],
    exports: [redisProvider, CacheService],
})
export class RedisModule { }