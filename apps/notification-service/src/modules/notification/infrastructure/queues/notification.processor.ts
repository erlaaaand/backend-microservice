// notification.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAMES, JOB_TYPES } from '../../../../shared/constants/queue.constants';
import { EmailChannel } from '../channels/email/email.channel';
import { INotificationRepository } from '../../domain/ports/notification-repository.port';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';

@Processor(QUEUE_NAMES.NOTIFICATION)
export class NotificationProcessor {
    private readonly logger = new Logger(NotificationProcessor.name);

    constructor(
        private readonly emailChannel: EmailChannel,
        private readonly notificationRepository: INotificationRepository,
    ) { }

    @Process(JOB_TYPES.SEND_EMAIL)
    async handleSendEmail(job: Job) {
        this.logger.log(`Processing job ${job.id}: ${JOB_TYPES.SEND_EMAIL}`);

        const { notificationId, payload } = job.data;

        try {
            // Update status to processing
            await this.notificationRepository.update(notificationId, {
                status: NotificationStatus.PROCESSING,
            });

            // Send email
            const result = await this.emailChannel.send(payload);

            if (result.success) {
                // Mark as sent
                await this.notificationRepository.update(notificationId, {
                    status: NotificationStatus.SENT,
                    sentAt: result.sentAt,
                    metadata: { messageId: result.messageId },
                });

                this.logger.log(`Email sent successfully for notification ${notificationId}`);
            } else {
                throw new Error(result.error || 'Unknown error');
            }

            return { success: true, notificationId };
        } catch (error) {
            this.logger.error(
                `Failed to send email for notification ${notificationId}:`,
                error.stack,
            );

            // Get current notification
            const notification = await this.notificationRepository.findById(notificationId);

            if (notification && notification.canRetry()) {
                // Update retry count
                await this.notificationRepository.update(notificationId, {
                    status: NotificationStatus.RETRY,
                    errorMessage: error.message,
                    retryCount: notification.retryCount + 1,
                });

                this.logger.warn(
                    `Notification ${notificationId} will be retried. Attempt ${notification.retryCount + 1}`,
                );
            } else {
                // Mark as failed permanently
                await this.notificationRepository.update(notificationId, {
                    status: NotificationStatus.FAILED,
                    failedAt: new Date(),
                    errorMessage: error.message,
                });

                this.logger.error(`Notification ${notificationId} failed permanently`);
            }

            throw error; // Let Bull handle retry
        }
    }

    @Process(JOB_TYPES.SEND_REMINDER)
    async handleSendReminder(job: Job) {
        this.logger.log(`Processing reminder job ${job.id}`);

        const { notificationId, payload } = job.data;

        try {
            const result = await this.emailChannel.send(payload);

            if (result.success) {
                await this.notificationRepository.update(notificationId, {
                    status: NotificationStatus.SENT,
                    sentAt: result.sentAt,
                });

                this.logger.log(`Reminder sent successfully for notification ${notificationId}`);
            } else {
                throw new Error(result.error);
            }

            return { success: true };
        } catch (error) {
            this.logger.error(`Failed to send reminder: ${error.message}`);
            throw error;
        }
    }
}