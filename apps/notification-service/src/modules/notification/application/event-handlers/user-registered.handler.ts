// user-registered.handler.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { NotificationPriority } from '../../domain/enums/notification-priority.enum';

interface UserRegisteredEvent {
    userId: string;
    email: string;
    phoneNumber?: string;
    verificationToken: string;
    timestamp: Date;
}

@Injectable()
export class UserRegisteredHandler {
    private readonly logger = new Logger(UserRegisteredHandler.name);

    constructor(private readonly notificationService: NotificationService) { }

    @OnEvent('user.registered')
    async handle(event: UserRegisteredEvent) {
        this.logger.log(`Handling user.registered event for user: ${event.userId}`);

        try {
            await this.notificationService.sendNotification({
                userId: event.userId,
                type: NotificationType.EMAIL,
                recipient: event.email,
                subject: 'Welcome to Our Platform!',
                templateName: 'welcome',
                templateData: {
                    userName: event.email.split('@')[0],
                    verificationUrl: `${process.env.APP_URL}/verify?token=${event.verificationToken}`,
                    verificationToken: event.verificationToken,
                    appName: 'My App',
                },
                priority: NotificationPriority.HIGH,
                metadata: {
                    eventType: 'user.registered',
                    timestamp: event.timestamp,
                },
            });

            this.logger.log(`Welcome email queued for user: ${event.userId}`);
        } catch (error) {
            this.logger.error(`Failed to send welcome email: ${error.message}`, error.stack);
        }
    }
}
