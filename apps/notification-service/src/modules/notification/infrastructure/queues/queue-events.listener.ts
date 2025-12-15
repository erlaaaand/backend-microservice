// queue-events.listener.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueStalled } from '@nestjs/bull';
import { Job } from 'bull';

@Injectable()
export class QueueEventsListener {
    private readonly logger = new Logger(QueueEventsListener.name);

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(`Job ${job.id} (${job.name}) is now active`);
    }

    @OnQueueCompleted()
    onCompleted(job: Job, result: any) {
        this.logger.log(`Job ${job.id} (${job.name}) completed successfully`, { result });
    }

    @OnQueueFailed()
    onFailed(job: Job, error: Error) {
        this.logger.error(
            `Job ${job.id} (${job.name}) failed after ${job.attemptsMade} attempts`,
            error.stack,
        );

        // TODO: Send alert if critical job fails
        // TODO: Log to external monitoring
    }

    @OnQueueStalled()
    onStalled(job: Job) {
        this.logger.warn(`Job ${job.id} (${job.name}) has stalled`);

        // TODO: Investigate stalled jobs
        // TODO: Send alert to ops team
    }
}