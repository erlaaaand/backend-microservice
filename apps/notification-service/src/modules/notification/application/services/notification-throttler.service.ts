// notification-throttler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ICacheService } from '../../domain/ports/cache.port';
import { CACHE_KEYS } from '../../../../shared/constants/cache.constants';
import { NotificationRateLimitException } from '../../domain/exceptions/notification-rate-limit.exception';

@Injectable()
export class NotificationThrottlerService {
    private readonly logger = new Logger(NotificationThrottlerService.name);

    constructor(private readonly cacheService: ICacheService) { }

    async checkRateLimit(recipient: string, maxPerHour: number = 10): Promise<void> {
        const key = CACHE_KEYS.RATE_LIMIT_EMAIL(recipient);
        const count = await this.cacheService.incr(key);

        if (count === 1) {
            // Set expiry for 1 hour
            await this.cacheService.expire(key, 3600);
        }

        if (count > maxPerHour) {
            this.logger.warn(`Rate limit exceeded for ${recipient}: ${count} emails`);
            throw new NotificationRateLimitException(recipient, 3600);
        }

        this.logger.debug(`Rate limit check passed for ${recipient}: ${count}/${maxPerHour}`);
    }

    async getRemainingQuota(recipient: string, maxPerHour: number = 10): Promise<number> {
        const key = CACHE_KEYS.RATE_LIMIT_EMAIL(recipient);
        const count = await this.cacheService.get<number>(key);
        return count ? Math.max(0, maxPerHour - count) : maxPerHour;
    }
}