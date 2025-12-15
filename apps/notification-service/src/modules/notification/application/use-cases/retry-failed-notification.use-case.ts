// retry-failed-notification.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';

@Injectable()
export class RetryFailedNotificationUseCase {
    private readonly logger = new Logger(RetryFailedNotificationUseCase.name);

    constructor(private readonly notificationService: NotificationService) { }

    async execute(notificationId: string): Promise<{ message: string; notificationId: string }> {
        this.logger.log(`Retrying notification: ${notificationId}`);

        try {
            await this.notificationService.retryNotification(notificationId);

            return {
                message: 'Notification queued for retry',
                notificationId,
            };
        } catch (error) {
            if (error.message === 'Notification not found') {
                throw new NotificationNotFoundException(notificationId);
            }
            throw error;
        }
    }
}