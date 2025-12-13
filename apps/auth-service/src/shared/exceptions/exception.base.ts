export interface SerializedException {
    message: string;
    code: string;
    stack?: string;
    metadata?: unknown;
}

/**
 * Base Class untuk custom exception di aplikasi kita.
 * Turunan dari class Error bawaan JS.
 */
export abstract class ExceptionBase extends Error {
    abstract code: string;

    constructor(
        readonly message: string,
        readonly metadata?: unknown,
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON(): SerializedException {
        return {
            message: this.message,
            code: this.code,
            stack: this.stack,
            metadata: this.metadata,
        };
    }
}