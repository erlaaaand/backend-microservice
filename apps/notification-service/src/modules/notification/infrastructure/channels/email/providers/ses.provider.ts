// providers/ses.provider.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class SESProvider {
    private readonly logger = new Logger(SESProvider.name);
    private ses: AWS.SES;

    constructor(private readonly configService: ConfigService) {
        const config = this.configService.get('email.ses');

        if (config.accessKeyId && config.secretAccessKey) {
            AWS.config.update({
                region: config.region,
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            });

            this.ses = new AWS.SES({ apiVersion: '2010-12-01' });
            this.logger.log('AWS SES provider initialized');
        } else {
            this.logger.warn('AWS SES credentials not configured');
        }
    }

    async sendMail(options: {
        to: string | string[];
        from?: string;
        subject: string;
        text?: string;
        html?: string;
        replyTo?: string;
    }): Promise<any> {
        try {
            const from = options.from || this.configService.get('email.ses.from');
            const to = Array.isArray(options.to) ? options.to : [options.to];

            const params: AWS.SES.SendEmailRequest = {
                Source: from,
                Destination: {
                    ToAddresses: to,
                },
                Message: {
                    Subject: {
                        Data: options.subject,
                        Charset: 'UTF-8',
                    },
                    Body: {
                        ...(options.text && {
                            Text: {
                                Data: options.text,
                                Charset: 'UTF-8',
                            },
                        }),
                        ...(options.html && {
                            Html: {
                                Data: options.html,
                                Charset: 'UTF-8',
                            },
                        }),
                    },
                },
                ...(options.replyTo && { ReplyToAddresses: [options.replyTo] }),
            };

            const result = await this.ses.sendEmail(params).promise();

            this.logger.log(`Email sent via SES to: ${to.join(', ')}`);

            return {
                messageId: result.MessageId,
                success: true,
            };
        } catch (error) {
            this.logger.error(`SES send failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    async sendBulkTemplatedEmail(params: AWS.SES.SendBulkTemplatedEmailRequest): Promise<any> {
        try {
            const result = await this.ses.sendBulkTemplatedEmail(params).promise();
            this.logger.log(`Bulk email sent via SES: ${params.Destinations.length} recipients`);
            return result;
        } catch (error) {
            this.logger.error(`SES bulk send failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    async verify(): Promise<boolean> {
        try {
            await this.ses.getSendQuota().promise();
            return true;
        } catch (error) {
            this.logger.error('SES verification failed', error);
            return false;
        }
    }

    async getSendQuota(): Promise<AWS.SES.GetSendQuotaResponse> {
        return this.ses.getSendQuota().promise();
    }

    async getSendStatistics(): Promise<AWS.SES.GetSendStatisticsResponse> {
        return this.ses.getSendStatistics().promise();
    }
}