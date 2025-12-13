// apps/auth-service/src/shared/api/interceptors/logging.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../../infrastructure/logging/logger.service';

/**
 * Interceptor untuk logging request & response
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {
        this.logger.setContext('HTTP');
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body } = request;
        const startTime = Date.now();

        this.logger.log(`Incoming Request: ${method} ${url}`, { body });

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const duration = Date.now() - startTime;
                    this.logger.log(`Request Completed: ${method} ${url}`, {
                        duration: `${duration}ms`,
                        statusCode: 200,
                    });
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.logger.error(`Request Failed: ${method} ${url}`, error.stack, {
                        duration: `${duration}ms`,
                        error: error.message,
                    });
                },
            }),
        );
    }
}
