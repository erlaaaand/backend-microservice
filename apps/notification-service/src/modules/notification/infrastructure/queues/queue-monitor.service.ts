// queue-monitor.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QUEUE_NAMES } from '../../../../shared/constants/queue.constants';

interface QueueHealth {
    name: string;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: boolean;
}

@Injectable()
export class QueueMonitorService {
    private readonly logger = new Logger(QueueMonitorService.name);

    constructor(
        @InjectQueue(QUEUE_NAMES.NOTIFICATION) private readonly notificationQueue: Queue,
        @InjectQueue(QUEUE_NAMES.BATCH_NOTIFICATION) private readonly batchQueue: Queue,
        @InjectQueue(QUEUE_NAMES.RETRY) private readonly retryQueue: Queue,
        @InjectQueue(QUEUE_NAMES.DEAD_LETTER) private readonly dlqQueue: Queue,
    ) { }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async monitorQueues() {
        this.logger.debug('Monitoring queue health...');

        const queues = [
            { name: QUEUE_NAMES.NOTIFICATION, queue: this.notificationQueue },
            { name: QUEUE_NAMES.BATCH_NOTIFICATION, queue: this.batchQueue },
            { name: QUEUE_NAMES.RETRY, queue: this.retryQueue },
            { name: QUEUE_NAMES.DEAD_LETTER, queue: this.dlqQueue },
        ];

        for (const { name, queue } of queues) {
            const health = await this.getQueueHealth(name, queue);

            this.logger.log(`Queue ${name} status:`, health);

            // Alert if too many failed jobs
            if (health.failed > 100) {
                this.logger.warn(`Queue ${name} has ${health.failed} failed jobs!`);
                // TODO: Send alert to monitoring
            }

            // Alert if queue is stalled
            if (health.waiting > 1000 && health.active === 0) {
                this.logger.warn(`Queue ${name} appears to be stalled!`);
                // TODO: Send alert to monitoring
            }
        }
    }

    async getQueueHealth(name: string, queue: Queue): Promise<QueueHealth> {
        const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
            queue.getWaitingCount(),
            queue.getActiveCount(),
            queue.getCompletedCount(),
            queue.getFailedCount(),
            queue.getDelayedCount(),
            queue.isPaused(),
        ]);

        return { name, waiting, active, completed, failed, delayed, paused };
    }

    async getAllQueueStats(): Promise<QueueHealth[]> {
        const queues = [
            { name: QUEUE_NAMES.NOTIFICATION, queue: this.notificationQueue },
            { name: QUEUE_NAMES.BATCH_NOTIFICATION, queue: this.batchQueue },
            { name: QUEUE_NAMES.RETRY, queue: this.retryQueue },
            { name: QUEUE_NAMES.DEAD_LETTER, queue: this.dlqQueue },
        ];

        return Promise.all(
            queues.map(({ name, queue }) => this.getQueueHealth(name, queue)),
        );
    }

    async cleanOldJobs(queue: Queue, olderThan: number = 7 * 24 * 60 * 60 * 1000) {
        // Clean completed jobs older than 7 days
        const completedJobs = await queue.getCompleted();
        const now = Date.now();

        for (const job of completedJobs) {
            if (job.finishedOn && now - job.finishedOn > olderThan) {
                await job.remove();
            }
        }

        this.logger.log(`Cleaned old completed jobs from ${queue.name}`);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async cleanupOldJobs() {
        this.logger.log('Running daily job cleanup...');

        await Promise.all([
            this.cleanOldJobs(this.notificationQueue),
            this.cleanOldJobs(this.batchQueue),
            this.cleanOldJobs(this.retryQueue),
        ]);

        this.logger.log('Daily cleanup completed');
    }
}