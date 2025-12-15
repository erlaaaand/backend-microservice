// queue.metrics.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QUEUE_NAMES } from '../../constants/queue.constants';
import { NotificationMetrics } from './notification.metrics';

@Injectable()
export class QueueMetricsCollector {
    private readonly logger = new Logger(QueueMetricsCollector.name);

    constructor(
        @InjectQueue(QUEUE_NAMES.NOTIFICATION) private readonly notificationQueue: Queue,
        @InjectQueue(QUEUE_NAMES.BATCH_NOTIFICATION) private readonly batchQueue: Queue,
        @InjectQueue(QUEUE_NAMES.RETRY) private readonly retryQueue: Queue,
        private readonly metrics: NotificationMetrics,
    ) { }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async collectQueueMetrics() {
        await this.collectForQueue(QUEUE_NAMES.NOTIFICATION, this.notificationQueue);
        await this.collectForQueue(QUEUE_NAMES.BATCH_NOTIFICATION, this.batchQueue);
        await this.collectForQueue(QUEUE_NAMES.RETRY, this.retryQueue);
    }

    private async collectForQueue(name: string, queue: Queue) {
        try {
            const [waiting, active, delayed, failed] = await Promise.all([
                queue.getWaitingCount(),
                queue.getActiveCount(),
                queue.getDelayedCount(),
                queue.getFailedCount(),
            ]);

            this.metrics.setQueueSize(name, 'waiting', waiting);
            this.metrics.setQueueSize(name, 'active', active);
            this.metrics.setQueueSize(name, 'delayed', delayed);
            this.metrics.setQueueSize(name, 'failed', failed);

            this.metrics.setActiveNotifications(active);
        } catch (error) {
            this.logger.error(`Failed to collect metrics for queue ${name}`, error);
        }
    }
}