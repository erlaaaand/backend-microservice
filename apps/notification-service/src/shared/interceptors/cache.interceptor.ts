// cache.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICacheService } from '../../modules/notification/domain/ports/cache.port';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    private readonly logger = new Logger(CacheInterceptor.name);

    constructor(
        private readonly cacheService: ICacheService,
        private readonly ttl: number = 300,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const cacheKey = this.generateCacheKey(request);

        // Check cache
        const cachedResponse = await this.cacheService.get(cacheKey);

        if (cachedResponse) {
            this.logger.debug(`Cache hit for key: ${cacheKey}`);
            return of(cachedResponse);
        }

        this.logger.debug(`Cache miss for key: ${cacheKey}`);

        // Execute handler and cache response
        return next.handle().pipe(
            tap(async (response) => {
                await this.cacheService.set(cacheKey, response, this.ttl);
                this.logger.debug(`Cached response for key: ${cacheKey}`);
            }),
        );
    }

    private generateCacheKey(request: any): string {
        const { method, url, query, params } = request;
        return `cache:${method}:${url}:${JSON.stringify(query)}:${JSON.stringify(params)}`;
    }
}