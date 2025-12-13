// apps/auth-service/src/shared/api/middlewares/request-context.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../../infrastructure/logging/request-context';

/**
 * Middleware untuk setup Request Context
 * Context ini bisa diakses di seluruh request lifecycle
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const requestId = req.headers['x-correlation-id'] as string;
        const user = (req as any).user;

        const context = {
            requestId,
            userId: user?.id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            timestamp: new Date(),
        };

        RequestContextService.run(context, () => {
            next();
        });
    }
}