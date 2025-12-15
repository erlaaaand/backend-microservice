// request-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
    requestId: string;
    userId?: string;
    ip: string;
    userAgent: string;
    timestamp: Date;
    path: string;
    method: string;
}

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const context: RequestContext = {
            requestId: (req.headers['x-request-id'] as string) || this.generateRequestId(),
            userId: (req.headers['x-user-id'] as string) || undefined,
            ip: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.get('user-agent') || 'unknown',
            timestamp: new Date(),
            path: req.path,
            method: req.method,
        };

        // Store context for the entire request lifecycle
        requestContextStorage.run(context, () => {
            res.setHeader('x-request-id', context.requestId);
            next();
        });
    }

    private generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}