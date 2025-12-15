
// user-events.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { NotificationService } from '../../../../application/services/notification.service';
import { NotificationType } from '../../../../domain/enums/notification-type.enum';
import { NotificationPriority } from '../../../../domain/enums/notification-priority.enum';

@Controller()
export class UserEventsConsumer {
    private readonly logger = new Logger(UserEventsConsumer.name);

    constructor(private readonly notificationService: NotificationService) { }

    @EventPattern('user.created')
    async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
        this.logger.log('Received user.created event', data);

        try {
            const { userId, email, verificationToken } = data;

            await this.notificationService.sendNotification({
                userId,
                type: NotificationType.EMAIL,
                recipient: email,
                subject: 'Welcome! Please verify your email',
                templateName: 'welcome',
                templateData: {
                    userName: email.split('@')[0],
                    verificationUrl: `${process.env.APP_URL}/verify?token=${verificationToken}`,
                    verificationToken,
                    appName: 'My App',
                },
                priority: NotificationPriority.HIGH,
            });

            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);

            this.logger.log(`Welcome email queued for user: ${userId}`);
        } catch (error) {
            this.logger.error('Failed to process user.created event', error.stack);

            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.nack(originalMsg, false, true); // Requeue
        }
    }

    @EventPattern('user.email.verification.requested')
    async handleEmailVerificationRequested(@Payload() data: any, @Ctx() context: RmqContext) {
        this.logger.log('Received email verification request', data);

        try {
            const { userId, email, verificationToken } = data;

            await this.notificationService.sendNotification({
                userId,
                type: NotificationType.EMAIL,
                recipient: email,
                subject: 'Email Verification',
                templateName: 'verification',
                templateData: {
                    userName: email.split('@')[0],
                    verificationUrl: `${process.env.APP_URL}/verify?token=${verificationToken}`,
                    verificationToken,
                },
                priority: NotificationPriority.HIGH,
            });

            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);
        } catch (error) {
            this.logger.error('Failed to send verification email', error.stack);

            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.nack(originalMsg, false, true);
        }
    }
}