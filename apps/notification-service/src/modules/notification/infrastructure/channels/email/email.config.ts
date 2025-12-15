// email.config.ts
import { registerAs } from '@nestjs/config';

export enum EmailProvider {
    SMTP = 'smtp',
    SENDGRID = 'sendgrid',
    SES = 'ses',
}

export default registerAs('email', () => ({
    provider: (process.env.EMAIL_PROVIDER as EmailProvider) || EmailProvider.SMTP,

    // SMTP Config
    smtp: {
        host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
        port: parseInt(process.env.SMTP_PORT, 10) || 2525,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    },

    // SendGrid Config
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        from: process.env.SENDGRID_FROM || 'noreply@myapp.com',
    },

    // AWS SES Config
    ses: {
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        from: process.env.SES_FROM || 'noreply@myapp.com',
    },

    // Common
    defaultFrom: process.env.SMTP_FROM || '"My App" <noreply@myapp.com>',
    replyTo: process.env.EMAIL_REPLY_TO,
}));