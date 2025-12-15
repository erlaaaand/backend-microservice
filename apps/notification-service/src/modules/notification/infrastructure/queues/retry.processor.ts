// retry.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAMES, JOB_TYPES } from '../../../../shared/constants/queue.constants';
import { NotificationService } from '../../application/services/notification.service';

@Processor(QUEUE_NAMES.RETRY)
export class RetryProcessor {
    private readonly logger = new Logger(RetryProcessor.name);

    constructor(private readonly notificationService: NotificationService) { }

    @Process(JOB_TYPES.RETRY_NOTIFICATION)
    async handleRetry(job: Job) {
        this.logger.log(`Processing retry job ${job.id}`);

        const { notificationId } = job.data;

        try {
            await this.notificationService.retryNotification(notificationId);
            return { success: true, notificationId };
        } catch (error) {
            this.logger.error(`Retry failed for notification ${notificationId}: ${error.message}`);
            throw error;
        }
    }
}