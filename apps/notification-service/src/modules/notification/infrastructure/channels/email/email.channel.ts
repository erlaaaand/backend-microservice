
// email.channel.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
    INotificationChannel,
    NotificationPayload,
    NotificationResult,
} from '../../../domain/ports/notification-channel.port';
import { NotificationType } from '../../../domain/enums/notification-type.enum';

@Injectable()
export class EmailChannel implements INotificationChannel {
    private readonly logger = new Logger(EmailChannel.name);

    constructor(private readonly mailerService: MailerService) { }

    async send(payload: NotificationPayload): Promise<NotificationResult> {
        try {
            this.logger.log(`Sending email to: ${payload.recipient}`);

            const result = await this.mailerService.sendMail({
                to: payload.recipient,
                subject: payload.subject || 'Notification',
                template: payload.templateName || 'default',
                context: payload.templateData || {},
                attachments: payload.attachments,
            });

            this.logger.log(`Email sent successfully. MessageId: ${result.messageId}`);

            return {
                success: true,
                messageId: result.messageId,
                sentAt: new Date(),
            };
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`, error.stack);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    getChannelType(): NotificationType {
        return NotificationType.EMAIL;
    }

    async isAvailable(): Promise<boolean> {
        try {
            await this.mailerService.sendMail({
                to: 'test@example.com',
                subject: 'Health Check',
                text: 'Test',
            }).catch(() => { });
            return true;
        } catch {
            return false;
        }
    }

    async validatePayload(payload: NotificationPayload): Promise<boolean> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(payload.recipient);
    }
}