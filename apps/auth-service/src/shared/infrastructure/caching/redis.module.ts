import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { getRedisConfig } from '../config/redis.config';

// Token Injection (Kunci untuk memanggil Redis di service lain)
export const REDIS_CLIENT = 'REDIS_CLIENT';

const redisProvider: Provider = {
    provide: REDIS_CLIENT,
    useFactory: (configService: ConfigService) => {
        return new Redis(getRedisConfig(configService));
    },
    inject: [ConfigService],
};

@Global() // Global: Agar tidak perlu import RedisModule berulang-ulang
@Module({
    providers: [redisProvider],
    exports: [redisProvider], // Export agar module lain bisa pakai
})
export class RedisModule { }