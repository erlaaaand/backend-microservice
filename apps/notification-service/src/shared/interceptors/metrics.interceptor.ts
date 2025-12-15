// metrics.interceptor.ts (already created but enhanced version)
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationMetrics } from '../monitoring/metrics/notification.metrics';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
    private readonly logger = new Logger(MetricsInterceptor.name);

    constructor(private readonly metrics: NotificationMetrics) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;

        return next.handle().pipe(
            tap({
                next: () => {
                    const duration = (Date.now() - now) / 1000;
                    this.logger.debug(`${method} ${url} - ${duration}s - Success`);

                    // Record metrics
                    if (this.metrics) {
                        this.metrics.recordDuration('http', 'success', duration);
                    }
                },
                error: (error) => {
                    const duration = (Date.now() - now) / 1000;
                    this.logger.error(`${method} ${url} - ${duration}s - Failed: ${error.message}`);

                    // Record error metrics
                    if (this.metrics) {
                        this.metrics.recordDuration('http', 'error', duration);
                    }
                },
            }),
        );
    }
}
