// alert-rules.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAMES } from '../../constants/queue.constants';
import { AlertService, AlertSeverity } from './alert.service';

@Injectable()
export class AlertRules {
    private readonly logger = new Logger(AlertRules.name);

    constructor(
        @InjectQueue(QUEUE_NAMES.NOTIFICATION) private readonly notificationQueue: Queue,
        private readonly alertService: AlertService,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async checkAlertRules() {
        await this.checkFailedJobsThreshold();
        await this.checkQueueBacklog();
        await this.checkStalledJobs();
    }

    private async checkFailedJobsThreshold() {
        const failedCount = await this.notificationQueue.getFailedCount();

        if (failedCount > 100) {
            this.alertService.sendAlert({
                title: 'High Failed Job Count',
                message: `Notification queue has ${failedCount} failed jobs`,
                severity: AlertSeverity.ERROR,
                metadata: { failedCount, queue: QUEUE_NAMES.NOTIFICATION },
            });
        }
    }

    private async checkQueueBacklog() {
        const [waiting, delayed] = await Promise.all([
            this.notificationQueue.getWaitingCount(),
            this.notificationQueue.getDelayedCount(),
        ]);

        const total = waiting + delayed;

        if (total > 1000) {
            this.alertService.sendAlert({
                title: 'Queue Backlog Warning',
                message: `Notification queue has ${total} pending jobs`,
                severity: AlertSeverity.WARNING,
                metadata: { waiting, delayed, total },
            });
        }
    }

    private async checkStalledJobs() {
        const jobs = await this.notificationQueue.getJobs(['active']);
        const now = Date.now();
        const stalledThreshold = 10 * 60 * 1000; // 10 minutes

        for (const job of jobs) {
            if (job.processedOn && now - job.processedOn > stalledThreshold) {
                this.alertService.sendAlert({
                    title: 'Stalled Job Detected',
                    message: `Job ${job.id} has been processing for over 10 minutes`,
                    severity: AlertSeverity.ERROR,
                    metadata: { jobId: job.id, processedOn: job.processedOn },
                });
            }
        }
    }
}