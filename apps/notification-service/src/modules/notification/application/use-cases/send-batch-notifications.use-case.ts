// send-batch-notifications.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { BatchNotificationDto } from '../dtos/requests/batch-notification.dto';
import { BatchResultResponseDto } from '../dtos/responses/batch-result-response.dto';
import { NotificationType } from '../../domain/enums/notification-type.enum';

@Injectable()
export class SendBatchNotificationsUseCase {
    private readonly logger = new Logger(SendBatchNotificationsUseCase.name);

    constructor(private readonly notificationService: NotificationService) { }

    async execute(dto: BatchNotificationDto): Promise<BatchResultResponseDto> {
        this.logger.log(`Executing SendBatchNotifications use case: ${dto.notifications.length} notifications`);

        const results = await Promise.allSettled(
            dto.notifications.map((notificationDto) =>
                this.notificationService.sendNotification({
                    userId: notificationDto.userId,
                    type: NotificationType.EMAIL,
                    recipient: notificationDto.recipient,
                    subject: notificationDto.subject,
                    content: notificationDto.content,
                    templateName: notificationDto.templateName,
                    templateData: notificationDto.templateData,
                    priority: notificationDto.priority,
                }),
            ),
        );

        const response: BatchResultResponseDto = {
            total: results.length,
            success: results.filter((r) => r.status === 'fulfilled').length,
            failed: results.filter((r) => r.status === 'rejected').length,
            results: results.map((result, index) => ({
                notificationId: result.status === 'fulfilled' ? result.value.id : null,
                success: result.status === 'fulfilled',
                error: result.status === 'rejected' ? result.reason.message : undefined,
            })),
        };

        this.logger.log(`Batch completed: ${response.success} succeeded, ${response.failed} failed`);

        return response;
    }
}