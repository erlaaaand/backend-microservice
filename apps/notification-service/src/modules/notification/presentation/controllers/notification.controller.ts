// notification.controller.ts
import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
    Delete,
} from '@nestjs/common';
import { NotificationService } from '../../application/services/notification.service';
import { SendEmailNotificationDto } from '../../application/dtos/requests/send-email-notification.dto';
import { BatchNotificationDto } from '../../application/dtos/requests/batch-notification.dto';
import { ScheduleReminderDto } from '../../application/dtos/requests/schedule-reminder.dto';
import { NotificationResponseDto } from '../../application/dtos/responses/notification-response.dto';
import { ApiKeyGuard } from '../../../../shared/guards/api-key.guard';
import { NotificationType } from '../../domain/enums/notification-type.enum';

@Controller('notifications')
@UseGuards(ApiKeyGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post('send')
    @HttpCode(HttpStatus.ACCEPTED)
    async sendNotification(
        @Body() dto: SendEmailNotificationDto,
    ): Promise<NotificationResponseDto> {
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

    @Post('batch')
    @HttpCode(HttpStatus.ACCEPTED)
    async sendBatchNotifications(@Body() dto: BatchNotificationDto) {
        const results = await Promise.allSettled(
            dto.notifications.map((n) =>
                this.notificationService.sendNotification({
                    userId: n.userId,
                    type: NotificationType.EMAIL,
                    recipient: n.recipient,
                    subject: n.subject,
                    templateName: n.templateName,
                    templateData: n.templateData,
                    priority: n.priority,
                }),
            ),
        );

        const response = {
            total: results.length,
            success: results.filter((r) => r.status === 'fulfilled').length,
            failed: results.filter((r) => r.status === 'rejected').length,
            results: results.map((r, index) => ({
                notificationId: r.status === 'fulfilled' ? r.value.id : null,
                success: r.status === 'fulfilled',
                error: r.status === 'rejected' ? r.reason.message : undefined,
            })),
        };

        return response;
    }

    @Post('reminder')
    @HttpCode(HttpStatus.ACCEPTED)
    async scheduleReminder(@Body() dto: ScheduleReminderDto) {
        return this.notificationService.sendNotification({
            userId: dto.userId,
            type: NotificationType.EMAIL,
            recipient: dto.recipient,
            subject: `Reminder: ${dto.reminderTitle}`,
            templateName: 'reminder',
            templateData: {
                userName: dto.recipient.split('@')[0],
                reminderTitle: dto.reminderTitle,
                reminderMessage: dto.reminderMessage,
                scheduledDate: dto.scheduledDate,
            },
            scheduledAt: new Date(dto.scheduledDate),
            metadata: dto.metadata,
        });
    }

    @Get(':id')
    async getNotificationStatus(@Param('id') id: string) {
        const notification = await this.notificationService.getNotificationStatus(id);

        if (!notification) {
            return { error: 'Notification not found' };
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

    @Get('user/:userId')
    async getUserNotifications(
        @Param('userId') userId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
    ) {
        return this.notificationService.getUserNotifications(userId, page, limit);
    }

    @Post(':id/retry')
    @HttpCode(HttpStatus.ACCEPTED)
    async retryNotification(@Param('id') id: string) {
        await this.notificationService.retryNotification(id);
        return { message: 'Notification queued for retry', notificationId: id };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async cancelNotification(@Param('id') id: string) {
        await this.notificationService.cancelNotification(id);
    }
}