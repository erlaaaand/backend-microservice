// exponential-backoff.strategy.ts
import { Injectable } from '@nestjs/common';
import { IRetryStrategy } from './retry-strategy.interface';

@Injectable()
export class ExponentialBackoffStrategy implements IRetryStrategy {
    constructor(
        private readonly initialDelay: number = 1000,
        private readonly maxDelay: number = 60000,
        private readonly multiplier: number = 2,
    ) { }

    calculateDelay(attemptNumber: number): number {
        const delay = this.initialDelay * Math.pow(this.multiplier, attemptNumber - 1);
        return Math.min(delay, this.maxDelay);
    }

    shouldRetry(attemptNumber: number, maxAttempts: number): boolean {
        return attemptNumber < maxAttempts;
    }

    getStrategyName(): string {
        return 'ExponentialBackoff';
    }
}