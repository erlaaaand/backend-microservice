// 1. Tambahkan 'Optional' ke dalam import
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException, Optional } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    // 2. Tambahkan decorator @Optional() di sini
    constructor(@Optional() private readonly timeoutMs: number = 30000) { }

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