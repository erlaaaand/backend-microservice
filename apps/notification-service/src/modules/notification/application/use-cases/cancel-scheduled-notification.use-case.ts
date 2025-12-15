// cancel-scheduled-notification.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';

@Injectable()
export class CancelScheduledNotificationUseCase {
    private readonly logger = new Logger(CancelScheduledNotificationUseCase.name);

    constructor(private readonly notificationService: NotificationService) { }

    async execute(notificationId: string): Promise<void> {
        this.logger.log(`Cancelling notification: ${notificationId}`);

        try {
            await this.notificationService.cancelNotification(notificationId);
            this.logger.log(`Notification ${notificationId} cancelled successfully`);
        } catch (error) {
            if (error.message === 'Notification not found') {
                throw new NotificationNotFoundException(notificationId);
            }
            throw error;
        }
    }
}