// queue-job.interface.ts
export interface IQueueJob<T = any> {
    id: string;
    data: T;
    attemptsMade: number;
    timestamp: number;
    processedOn?: number;
    finishedOn?: number;
    failedReason?: string;
}