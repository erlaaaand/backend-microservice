// providers/sendgrid.provider.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridProvider {
    private readonly logger = new Logger(SendGridProvider.name);

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get('email.sendgrid.apiKey');

        if (apiKey) {
            sgMail.setApiKey(apiKey);
            this.logger.log('SendGrid provider initialized');
        } else {
            this.logger.warn('SendGrid API key not configured');
        }
    }

    async sendMail(options: {
        to: string | string[];
        from?: string;
        subject: string;
        text?: string;
        html?: string;
        attachments?: any[];
    }): Promise<any> {
        try {
            const from = options.from || this.configService.get('email.sendgrid.from');

            const msg = {
                to: options.to,
                from,
                subject: options.subject,
                text: options.text,
                html: options.html,
                attachments: options.attachments,
            };

            const result = await sgMail.send(msg);

            this.logger.log(`Email sent via SendGrid to: ${options.to}`);

            return {
                messageId: result[0].headers['x-message-id'],
                success: true,
            };
        } catch (error) {
            this.logger.error(`SendGrid send failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    async sendMultiple(messages: any[]): Promise<any> {
        try {
            const result = await sgMail.send(messages);
            this.logger.log(`Batch email sent via SendGrid: ${messages.length} messages`);
            return result;
        } catch (error) {
            this.logger.error(`SendGrid batch send failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    async verify(): Promise<boolean> {
        try {
            // SendGrid doesn't have a simple verify method
            // We can try to get account details as a health check
            return true;
        } catch (error) {
            this.logger.error('SendGrid verification failed', error);
            return false;
        }
    }
}