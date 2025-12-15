import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Logger,
    Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_KEYS } from '../constants/cache.constants';
// Sesuaikan import path ICacheService
import { ICacheService } from '../../modules/notification/domain/ports/cache.port';

@Injectable()
export class ThrottleGuard implements CanActivate {
    private readonly logger = new Logger(ThrottleGuard.name);

    constructor(
        private readonly configService: ConfigService,
        @Inject('ICacheService') private readonly cacheService: ICacheService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Ambil konfigurasi dari throttle.config.ts
        const throttleLimit = this.configService.get<number>('throttle.limit') || 50;
        const throttleTtl = this.configService.get<number>('throttle.ttl') || 60000; // ms
        const ttlSeconds = Math.ceil(throttleTtl / 1000);

        // Generate Key menggunakan generator dari config atau default ke IP
        // Menggunakan prefix CACHE_PREFIXES.THROTTLE dari constants
        const ip = request.ip || request.connection.remoteAddress;
        const endpoint = `${request.method}:${request.path}`;

        // Key unik kombinasi IP dan Endpoint untuk mencegah spam di endpoint spesifik
        const key = CACHE_KEYS.THROTTLE_REQUEST(`${ip}:${endpoint}`);

        try {
            const currentCount = await this.cacheService.get<number>(key) || 0;

            if (currentCount >= throttleLimit) {
                this.logger.warn(`Throttling request from ${ip} to ${endpoint}`);
                throw new HttpException(
                    {
                        statusCode: HttpStatus.TOO_MANY_REQUESTS,
                        message: 'Throttled',
                        description: 'Too many requests in a short period',
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }

            // Increment dan Set Expiry
            if (currentCount === 0) {
                await this.cacheService.set(key, 1, ttlSeconds);
            } else {
                await this.cacheService.set(key, Number(currentCount) + 1, ttlSeconds);
            }

            return true;

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            this.logger.error(`Error in ThrottleGuard: ${error.message}`);
            // Fail safe: izinkan request jika redis down
            return true;
        }
    }
}