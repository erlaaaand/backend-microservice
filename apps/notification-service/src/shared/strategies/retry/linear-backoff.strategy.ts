// linear-backoff.strategy.ts
import { Injectable } from '@nestjs/common';
import { IRetryStrategy } from './retry-strategy.interface';

@Injectable()
export class LinearBackoffStrategy implements IRetryStrategy {
    constructor(
        private readonly initialDelay: number = 1000,
        private readonly increment: number = 1000,
        private readonly maxDelay: number = 30000,
    ) { }

    calculateDelay(attemptNumber: number): number {
        const delay = this.initialDelay + (attemptNumber - 1) * this.increment;
        return Math.min(delay, this.maxDelay);
    }

    shouldRetry(attemptNumber: number, maxAttempts: number): boolean {
        return attemptNumber < maxAttempts;
    }

    getStrategyName(): string {
        return 'LinearBackoff';
    }
}
