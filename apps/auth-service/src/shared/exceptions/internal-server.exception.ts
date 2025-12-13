// apps/auth-service/src/shared/exceptions/internal-server.exception.ts

import { ExceptionBase } from './exception.base';

/**
 * Exception untuk internal server error
 */
export class InternalServerException extends ExceptionBase {
    readonly code = 'INTERNAL_SERVER_ERROR';

    constructor(message: string = 'Internal server error', metadata?: unknown) {
        super(message, metadata);
    }
}