// send-notification.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { SendEmailNotificationDto } from '../dtos/requests/send-email-notification.dto';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { NotificationResponseDto } from '../dtos/responses/notification-response.dto';

@Injectable()
export class SendNotificationUseCase {
    private readonly logger = new Logger(SendNotificationUseCase.name);

    constructor(private readonly notificationService: NotificationService) { }

    async execute(dto: SendEmailNotificationDto): Promise<NotificationResponseDto> {
        this.logger.log(`Executing SendNotification use case for user: ${dto.userId}`);

        const notification = await this.notificationService.sendNotification({
            userId: dto.userId,
            type: NotificationType.EMAIL,
            recipient: dto.recipient,
            subject: dto.subject,
            content: dto.content,
            templateName: dto.templateName,
            templateData: dto.templateData,
            priority: dto.priority,
            scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
            metadata: dto.metadata,
        });

        return {
            id: notification.id,
            userId: notification.userId,
            type: notification.type,
            recipient: notification.recipient,
            subject: notification.subject,
            status: notification.status,
            priority: notification.priority,
            sentAt: notification.sentAt,
            failedAt: notification.failedAt,
            errorMessage: notification.errorMessage,
            retryCount: notification.retryCount,
            createdAt: notification.createdAt,
        };
    }
}