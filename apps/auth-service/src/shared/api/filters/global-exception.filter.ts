import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ArgumentInvalidException } from '../../exceptions/argument-invalid.exception'; // Import exception kita

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
        // 2. Handle Domain Exceptions (Custom kita)
        else if (exception instanceof ArgumentInvalidException) {
            status = HttpStatus.BAD_REQUEST; // 400
            message = exception.message;
            code = exception.code;
        }
        // 3. Handle Error lainnya...

        // Logging Error (Penting untuk debugging)
        this.logger.error(
            `[${request.method}] ${request.url}`,
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