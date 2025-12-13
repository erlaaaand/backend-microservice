// apps/auth-service/src/shared/exceptions/conflict.exception.ts

import { ExceptionBase } from './exception.base';

/**
 * Exception ketika terjadi conflict (misal: email sudah terdaftar)
 */
export class ConflictException extends ExceptionBase {
    readonly code = 'CONFLICT';

    constructor(message: string = 'Resource conflict', metadata?: unknown) {
        super(message, metadata);
    }
}
