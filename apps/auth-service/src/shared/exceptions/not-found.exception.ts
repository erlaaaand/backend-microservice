// apps/auth-service/src/shared/exceptions/not-found.exception.ts

import { ExceptionBase } from './exception.base';

/**
 * Exception ketika resource tidak ditemukan
 */
export class NotFoundException extends ExceptionBase {
    readonly code = 'NOT_FOUND';

    constructor(message: string = 'Resource not found', metadata?: unknown) {
        super(message, metadata);
    }
}