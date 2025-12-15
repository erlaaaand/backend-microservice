// fixed-delay.strategy.ts
import { Injectable } from '@nestjs/common';
import { IRetryStrategy } from './retry-strategy.interface';

@Injectable()
export class FixedDelayStrategy implements IRetryStrategy {
    constructor(private readonly delay: number = 5000) { }

    calculateDelay(attemptNumber: number): number {
        return this.delay;
    }

    shouldRetry(attemptNumber: number, maxAttempts: number): boolean {
        return attemptNumber < maxAttempts;
    }

    getStrategyName(): string {
        return 'FixedDelay';
    }
}
