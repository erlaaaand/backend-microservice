// apps/auth-service/src/shared/api/interceptors/timeout.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * Interceptor untuk set timeout pada request
 * Default: 30 detik
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    constructor(private readonly timeoutMs: number = 30000) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(this.timeoutMs),
            catchError(err => {
                if (err instanceof TimeoutError) {
                    return throwError(() => new RequestTimeoutException('Request timeout'));
                }
                return throwError(() => err);
            }),
        );
    }
}