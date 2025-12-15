// indicators/queue.indicator.ts
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAMES } from '../../../shared/constants/queue.constants';

@Injectable()
export class QueueHealthIndicator extends HealthIndicator {
    constructor(@InjectQueue(QUEUE_NAMES.NOTIFICATION) private queue: Queue) {
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            const jobCounts = await this.queue.getJobCounts();
            const isHealthy = jobCounts.failed < 100; // threshold

            if (!isHealthy) {
                throw new Error('Too many failed jobs');
            }

            return this.getStatus(key, true, { jobCounts });
        } catch (error) {
            throw new HealthCheckError('Queue check failed', this.getStatus(key, false));
        }
    }
}