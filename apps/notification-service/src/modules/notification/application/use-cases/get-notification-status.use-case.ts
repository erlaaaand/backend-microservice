// get-notification-status.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationStatusResponseDto } from '../dtos/responses/notification-status-response.dto';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';

@Injectable()
export class GetNotificationStatusUseCase {
    private readonly logger = new Logger(GetNotificationStatusUseCase.name);

    constructor(private readonly notificationService: NotificationService) { }

    async execute(notificationId: string): Promise<NotificationStatusResponseDto> {
        this.logger.log(`Getting status for notification: ${notificationId}`);

        const notification = await this.notificationService.getNotificationStatus(notificationId);

        if (!notification) {
            throw new NotificationNotFoundException(notificationId);
        }

        return {
            id: notification.id,
            status: notification.status,
            sentAt: notification.sentAt,
            failedAt: notification.failedAt,
            errorMessage: notification.errorMessage,
            retryCount: notification.retryCount,
            canRetry: notification.canRetry(),
        };
    }
}