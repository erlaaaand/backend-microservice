// dead-letter.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAMES } from '../../../../shared/constants/queue.constants';
import { INotificationRepository } from '../../domain/ports/notification-repository.port';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';

@Processor(QUEUE_NAMES.DEAD_LETTER)
export class DeadLetterProcessor {
    private readonly logger = new Logger(DeadLetterProcessor.name);

    constructor(private readonly notificationRepository: INotificationRepository) { }

    @Process()
    async handleDeadLetter(job: Job) {
        this.logger.error(`Processing dead letter job ${job.id}`, job.data);

        const { notificationId, originalData, failureReason } = job.data;

        try {
            // Mark notification as permanently failed
            await this.notificationRepository.update(notificationId, {
                status: NotificationStatus.FAILED,
                failedAt: new Date(),
                errorMessage: `Dead letter queue: ${failureReason}`,
            });

            this.logger.error(`Notification ${notificationId} moved to dead letter queue`);

            // TODO: Send alert to monitoring system
            // TODO: Log to external error tracking (Sentry, DataDog, etc.)

            return { success: true, notificationId, action: 'marked_as_failed' };
        } catch (error) {
            this.logger.error(`Failed to process dead letter: ${error.message}`, error.stack);
            throw error;
        }
    }
}
