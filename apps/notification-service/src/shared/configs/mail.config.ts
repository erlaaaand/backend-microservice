import { registerAs } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export default registerAs(
    'mail',
    (): MailerOptions => ({
        transport: {
            host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT, 10) || 2525,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || '',
            },
            // Connection timeout
            connectionTimeout: 5000,
            greetingTimeout: 5000,
        },

        defaults: {
            from: process.env.SMTP_FROM || '"My App System" <noreply@myapp.com>',
        },

        // Template Configuration
        template: {
            dir: join(__dirname, '../../modules/notification/infrastructure/channels/email/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },

        // Email Options
        options: {
            partials: {
                dir: join(__dirname, '../../modules/notification/infrastructure/channels/email/templates/partials'),
                options: {
                    strict: true,
                },
            },
        },
    }),
);