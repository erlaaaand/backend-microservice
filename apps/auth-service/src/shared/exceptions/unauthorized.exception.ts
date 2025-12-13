// apps/auth-service/src/shared/exceptions/unauthorized.exception.ts

import { ExceptionBase } from './exception.base';

/**
 * Exception ketika authentication gagal
 */
export class UnauthorizedException extends ExceptionBase {
    readonly code = 'UNAUTHORIZED';

    constructor(message: string = 'Unauthorized access', metadata?: unknown) {
        super(message, metadata);
    }
}
