import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
    meta?: any;
}

/**
 * Membungkus semua response sukses menjadi format standar:
 * {
 * "data": { ... },
 * "meta": { "timestamp": ... }
 * }
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => ({
                data,
                meta: {
                    timestamp: new Date().toISOString(),
                },
            })),
        );
    }
}