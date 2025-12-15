import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Logger,
    Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RATE_LIMIT_CONSTANTS } from '../constants/rate-limit.constants';
import { CACHE_KEYS, CACHE_TTL } from '../constants/cache.constants';
// Pastikan path import ini sesuai dengan lokasi ICacheService Anda
// Berdasarkan cache.interceptor.ts, path-nya mungkin seperti ini:
import { ICacheService } from '../../modules/notification/domain/ports/cache.port';

@Injectable()
export class RateLimitGuard implements CanActivate {
    private readonly logger = new Logger(RateLimitGuard.name);

    constructor(
        private readonly cacheService: ICacheService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const ip = request.ip || request.connection.remoteAddress;
        const user = request.user; // Diasumsikan user sudah di-attach oleh AuthGuard/Middleware

        // 1. Tentukan Limit dan Key
        // Prioritas: User Limit -> IP Limit
        let key: string;
        let limit: number;
        let ttl: number;

        if (user && user.id) {
            // Jika user login, gunakan limit per user
            key = `rate-limit:user:${user.id}`;
            limit = RATE_LIMIT_CONSTANTS.USER_REQUESTS_PER_MINUTE;
            ttl = 60; // 1 menit
        } else {
            // Jika guest, gunakan limit IP
            key = CACHE_KEYS.RATE_LIMIT_IP(ip);
            limit = RATE_LIMIT_CONSTANTS.IP_REQUESTS_PER_MINUTE;
            ttl = 60; // 1 menit
        }

        // 2. Cek Cache
        try {
            const currentCount = await this.cacheService.get<number>(key) || 0;

            if (currentCount >= limit) {
                this.logger.warn(`Rate limit exceeded for ${key}. Count: ${currentCount}/${limit}`);
                throw new HttpException(
                    {
                        statusCode: HttpStatus.TOO_MANY_REQUESTS,
                        message: 'Too Many Requests',
                        error: 'Rate Limit Exceeded',
                        retryAfter: ttl,
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }

            // 3. Increment Counter
            // Jika ini request pertama, set TTL
            if (currentCount === 0) {
                await this.cacheService.set(key, 1, ttl);
            } else {
                // Implementasi increment tergantung pada method ICacheService Anda.
                // Jika ICacheService tidak punya method incr, kita get + set manual (sedikit race condition tapi oke untuk non-critical)
                // Asumsi ada method incr atau kita set ulang
                await this.cacheService.set(key, Number(currentCount) + 1, ttl);
                // Note: Idealnya gunakan redis.incr() jika tersedia di service
            }

            // Set headers untuk informasi client
            const response = context.switchToHttp().getResponse();
            response.header('X-RateLimit-Limit', limit.toString());
            response.header('X-RateLimit-Remaining', (limit - (currentCount + 1)).toString());

            return true;

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            // Fail open: Jika cache error, biarkan request lewat tapi log errornya
            this.logger.error(`Error in RateLimitGuard: ${error.message}`);
            return true;
        }
    }
}