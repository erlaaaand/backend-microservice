// apps/auth-service/src/shared/exceptions/validation.exception.ts

import { ExceptionBase } from './exception.base';

/**
 * Exception untuk validation error
 */
export class ValidationException extends ExceptionBase {
    readonly code = 'VALIDATION_ERROR';

    constructor(message: string = 'Validation failed', metadata?: unknown) {
        super(message, metadata);
    }
}