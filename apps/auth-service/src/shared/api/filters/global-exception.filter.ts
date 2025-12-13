// Update: apps/auth-service/src/shared/api/filters/global-exception.filter.ts

import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ArgumentInvalidException } from '../../exceptions/argument-invalid.exception';
import { NotFoundException } from '../../exceptions/not-found.exception';
import { ConflictException } from '../../exceptions/conflict.exception';
import { ForbiddenException } from '../../exceptions/forbidden.exception';
import { UnauthorizedException } from '../../exceptions/unauthorized.exception';
import { InternalServerException } from '../../exceptions/internal-server.exception';
import { ValidationException } from '../../exceptions/validation.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'INTERNAL_ERROR';

        // 1. Handle NestJS HTTP Exceptions (Standard)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            message = (errorResponse as any).message || exception.message;
            code = (errorResponse as any).error || 'HTTP_ERROR';
        }
        // 2. Handle Domain Exceptions (Custom)
        else if (exception instanceof ArgumentInvalidException) {
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof ValidationException) {
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof NotFoundException) {
            status = HttpStatus.NOT_FOUND;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof ConflictException) {
            status = HttpStatus.CONFLICT;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof UnauthorizedException) {
            status = HttpStatus.UNAUTHORIZED;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof ForbiddenException) {
            status = HttpStatus.FORBIDDEN;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof InternalServerException) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message;
            code = exception.code;
        }

        // Logging Error
        this.logger.error(
            `[${request.method}] ${request.url} - ${code}: ${message}`,
            exception instanceof Error ? exception.stack : String(exception),
        );

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: {
                code: code,
                message: message,
            },
        });
    }
}