// circuit-breaker.ts
import { Injectable, Logger } from '@nestjs/common';
import { CircuitBreakerConfig, DEFAULT_CIRCUIT_BREAKER_CONFIG } from './circuit-breaker.config';

enum CircuitState {
    CLOSED = 'CLOSED', // Normal operation
    OPEN = 'OPEN', // Circuit is open, rejecting requests
    HALF_OPEN = 'HALF_OPEN', // Testing if service is back
}

@Injectable()
export class CircuitBreaker {
    private readonly logger = new Logger(CircuitBreaker.name);
    private state: CircuitState = CircuitState.CLOSED;
    private failureCount = 0;
    private successCount = 0;
    private nextAttempt: number = Date.now();

    constructor(
        private readonly name: string,
        private readonly config: CircuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER_CONFIG,
    ) { }

    async execute<T>(operation: () => Promise<T>): Promise<T> {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() < this.nextAttempt) {
                throw new Error(`Circuit breaker ${this.name} is OPEN`);
            }

            // Try to recover
            this.state = CircuitState.HALF_OPEN;
            this.logger.warn(`Circuit breaker ${this.name} entering HALF_OPEN state`);
        }

        try {
            const result = await Promise.race([
                operation(),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('Operation timeout')), this.config.timeout),
                ),
            ]);

            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure(error);
            throw error;
        }
    }

    private onSuccess(): void {
        this.failureCount = 0;

        if (this.state === CircuitState.HALF_OPEN) {
            this.successCount++;

            if (this.successCount >= this.config.successThreshold) {
                this.state = CircuitState.CLOSED;
                this.successCount = 0;
                this.logger.log(`Circuit breaker ${this.name} is now CLOSED`);
            }
        }
    }

    private onFailure(error: Error): void {
        this.failureCount++;
        this.logger.error(
            `Circuit breaker ${this.name} failure ${this.failureCount}/${this.config.failureThreshold}`,
            error.message,
        );

        if (this.failureCount >= this.config.failureThreshold) {
            this.state = CircuitState.OPEN;
            this.nextAttempt = Date.now() + this.config.resetTimeout;
            this.logger.error(
                `Circuit breaker ${this.name} is now OPEN. Will retry at ${new Date(this.nextAttempt).toISOString()}`,
            );
        }

        if (this.state === CircuitState.HALF_OPEN) {
            this.state = CircuitState.OPEN;
            this.nextAttempt = Date.now() + this.config.resetTimeout;
            this.successCount = 0;
            this.logger.error(`Circuit breaker ${this.name} returned to OPEN state`);
        }
    }

    getState(): CircuitState {
        return this.state;
    }

    getStats() {
        return {
            name: this.name,
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            nextAttempt: this.state === CircuitState.OPEN ? new Date(this.nextAttempt) : null,
        };
    }

    reset(): void {
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.logger.log(`Circuit breaker ${this.name} has been reset`);
    }
}
