import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

// [TAMBAHAN BARU] Pindahkan konstanta ke sini
export const REDIS_CLIENT = 'REDIS_CLIENT';

export const getRedisConfig = (configService: ConfigService): RedisOptions => ({
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<number>('REDIS_PORT'),
});