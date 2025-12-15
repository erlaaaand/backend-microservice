// retry-strategy.interface.ts
export interface IRetryStrategy {
    calculateDelay(attemptNumber: number): number;
    shouldRetry(attemptNumber: number, maxAttempts: number): boolean;
    getStrategyName(): string;
}