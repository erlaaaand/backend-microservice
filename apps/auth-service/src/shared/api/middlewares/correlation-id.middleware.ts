// apps/auth-service/src/shared/api/middlewares/correlation-id.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware untuk menambahkan Correlation ID ke setiap request
 * Berguna untuk tracking request across microservices
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const correlationId = req.headers['x-correlation-id'] as string || uuidv4();

        req.headers['x-correlation-id'] = correlationId;
        res.setHeader('x-correlation-id', correlationId);

        next();
    }
}