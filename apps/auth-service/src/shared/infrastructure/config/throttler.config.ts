// apps/auth-service/src/shared/infrastructure/config/throttler.config.ts

import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

/**
 * Rate limiting configuration
 * Default: 10 requests per 60 seconds
 */
export const getThrottlerConfig = (configService: ConfigService): ThrottlerModuleOptions => ({
    throttlers: [
        {
            ttl: configService.get<number>('THROTTLE_TTL', 60000), // milliseconds
            limit: configService.get<number>('THROTTLE_LIMIT', 10),
        },
    ],
});