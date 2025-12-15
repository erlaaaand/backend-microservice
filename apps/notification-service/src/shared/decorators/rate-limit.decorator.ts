import { ICacheService } from '../../modules/notification/domain/ports/cache.port'; //

// Interface untuk memastikan 'this' memiliki cacheService
interface IWithCacheService {
    cacheService?: ICacheService;
}

export function RateLimit(options: {
    key: string | ((...args: unknown[]) => string);
    limit: number;
    ttl: number; // in seconds
}) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        // Tentukan tipe 'this' sebagai IWithCacheService
        descriptor.value = async function (this: IWithCacheService, ...args: unknown[]) {
            const cacheService = this.cacheService;

            if (!cacheService) {
                // Fail-safe jika service tidak di-inject
                return originalMethod.apply(this, args);
            }

            const rateLimitKey = typeof options.key === 'function'
                ? options.key(...args)
                : options.key;

            // Sekarang cacheService sudah memiliki tipe, jadi generic <number> valid
            const count = await cacheService.get<number>(rateLimitKey) || 0;

            if (count >= options.limit) {
                throw new Error(`Rate limit exceeded for ${rateLimitKey}`);
            }

            // Increment counter
            await cacheService.incr(rateLimitKey);

            // Set TTL on first request
            if (count === 0) {
                await cacheService.expire(rateLimitKey, options.ttl);
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}