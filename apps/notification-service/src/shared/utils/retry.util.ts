// retry.util.ts
import { Logger } from '@nestjs/common';

export interface RetryOptions {
    maxAttempts?: number;
    delay?: number;
    backoff?: 'fixed' | 'exponential' | 'linear';
    multiplier?: number;
    maxDelay?: number;
    onRetry?: (error: Error, attempt: number) => void;
    shouldRetry?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: RetryOptions = {
    maxAttempts: 3,
    delay: 1000,
    backoff: 'exponential',
    multiplier: 2,
    maxDelay: 60000,
};

export class RetryUtil {
    private static readonly logger = new Logger(RetryUtil.name);

    /**
     * Retry an async operation with configurable backoff
     */
    static async retry<T>(
        operation: () => Promise<T>,
        options: RetryOptions = {},
    ): Promise<T> {
        const opts = { ...DEFAULT_OPTIONS, ...options };
        let lastError: Error;

        for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;

                // Check if we should retry this error
                if (opts.shouldRetry && !opts.shouldRetry(error)) {
                    throw error;
                }

                // Don't delay after last attempt
                if (attempt < opts.maxAttempts) {
                    const delay = this.calculateDelay(attempt, opts);

                    if (opts.onRetry) {
                        opts.onRetry(error, attempt);
                    }

                    this.logger.warn(
                        `Attempt ${attempt}/${opts.maxAttempts} failed. Retrying in ${delay}ms...`,
                        error.message,
                    );

                    await this.sleep(delay);
                }
            }
        }

        throw lastError;
    }

    /**
     * Calculate delay based on backoff strategy
     */
    private static calculateDelay(attempt: number, options: RetryOptions): number {
        let delay: number;

        switch (options.backoff) {
            case 'fixed':
                delay = options.delay;
                break;

            case 'linear':
                delay = options.delay * attempt;
                break;

            case 'exponential':
            default:
                delay = options.delay * Math.pow(options.multiplier, attempt - 1);
                break;
        }

        return Math.min(delay, options.maxDelay);
    }

    /**
     * Sleep for specified milliseconds
     */
    private static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Retry with exponential backoff (convenience method)
     */
    static async retryWithBackoff<T>(
        operation: () => Promise<T>,
        maxAttempts: number = 3,
    ): Promise<T> {
        return this.retry(operation, {
            maxAttempts,
            backoff: 'exponential',
        });
    }

    /**
     * Retry only on specific errors
     */
    static async retryOn<T>(
        operation: () => Promise<T>,
        retryableErrors: string[],
        maxAttempts: number = 3,
    ): Promise<T> {
        return this.retry(operation, {
            maxAttempts,
            shouldRetry: (error) => {
                return retryableErrors.some((errName) =>
                    error.name === errName || error.message.includes(errName)
                );
            },
        });
    }
}