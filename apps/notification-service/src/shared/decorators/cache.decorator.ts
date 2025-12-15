// cache.decorator.ts
export function Cacheable(options: {
    key: string | ((...args: any[]) => string);
    ttl?: number;
}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const cacheService = this.cacheService;

            if (!cacheService) {
                return originalMethod.apply(this, args);
            }

            const cacheKey = typeof options.key === 'function'
                ? options.key(...args)
                : options.key;

            // Check cache
            const cached = await cacheService.get(cacheKey);
            if (cached) {
                return cached;
            }

            // Execute method
            const result = await originalMethod.apply(this, args);

            // Store in cache
            await cacheService.set(cacheKey, result, options.ttl);

            return result;
        };

        return descriptor;
    };
}
