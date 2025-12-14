import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { getRedisConfig, REDIS_CLIENT } from '../config/redis.config';
import { CacheService } from './cache.service';

// [HAPUS BARIS INI] export const REDIS_CLIENT = 'REDIS_CLIENT';

const redisProvider: Provider = {
    provide: REDIS_CLIENT,
    useFactory: (configService: ConfigService) => {
        return new Redis(getRedisConfig(configService));
    },
    inject: [ConfigService],
};

@Global()
@Module({
    imports: [ConfigModule],
    providers: [redisProvider, CacheService],
    exports: [redisProvider, CacheService],
})
export class RedisModule {}