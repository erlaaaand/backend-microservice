// apps/auth-service/src/shared/exceptions/forbidden.exception.ts

import { ExceptionBase } from './exception.base';

/**
 * Exception ketika user tidak memiliki permission
 */
export class ForbiddenException extends ExceptionBase {
    readonly code = 'FORBIDDEN';

    constructor(message: string = 'Access forbidden', metadata?: unknown) {
        super(message, metadata);
    }
}