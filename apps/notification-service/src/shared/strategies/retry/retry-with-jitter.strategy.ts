// retry-with-jitter.strategy.ts
import { Injectable } from '@nestjs/common';
import { IRetryStrategy } from './retry-strategy.interface';

/**
 * Exponential backoff with jitter to avoid thundering herd problem
 */
@Injectable()
export class RetryWithJitterStrategy implements IRetryStrategy {
    constructor(
        private readonly baseStrategy: IRetryStrategy,
        private readonly jitterFactor: number = 0.2,
    ) { }

    calculateDelay(attemptNumber: number): number {
        const baseDelay = this.baseStrategy.calculateDelay(attemptNumber);
        const jitter = baseDelay * this.jitterFactor * Math.random();
        return Math.floor(baseDelay + jitter);
    }

    shouldRetry(attemptNumber: number, maxAttempts: number): boolean {
        return this.baseStrategy.shouldRetry(attemptNumber, maxAttempts);
    }

    getStrategyName(): string {
        return `${this.baseStrategy.getStrategyName()}WithJitter`;
    }
}