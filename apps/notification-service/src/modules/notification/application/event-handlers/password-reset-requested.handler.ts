// password-reset-requested.handler.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { NotificationPriority } from '../../domain/enums/notification-priority.enum';

interface PasswordResetRequestedEvent {
    userId: string;
    email: string;
    resetToken: string;
    timestamp: Date;
}

@Injectable()
export class PasswordResetRequestedHandler {
    private readonly logger = new Logger(PasswordResetRequestedHandler.name);

    constructor(private readonly notificationService: NotificationService) { }

    @OnEvent('password.reset.requested')
    async handle(event: PasswordResetRequestedEvent) {
        this.logger.log(`Handling password.reset.requested event for user: ${event.userId}`);

        try {
            await this.notificationService.sendNotification({
                userId: event.userId,
                type: NotificationType.EMAIL,
                recipient: event.email,
                subject: 'Password Reset Request',
                templateName: 'password-reset',
                templateData: {
                    userName: event.email.split('@')[0],
                    resetUrl: `${process.env.APP_URL}/reset-password?token=${event.resetToken}`,
                    appName: 'My App',
                },
                priority: NotificationPriority.CRITICAL,
                metadata: {
                    eventType: 'password.reset.requested',
                    timestamp: event.timestamp,
                },
            });

            this.logger.log(`Password reset email queued for user: ${event.userId}`);
        } catch (error) {
            this.logger.error(`Failed to send password reset email: ${error.message}`, error.stack);
        }
    }
}