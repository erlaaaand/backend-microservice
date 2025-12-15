import { NotificationType } from '../enums/notification-type.enum';
// notification-channel.port.ts
export interface INotificationChannel {
    send(payload: NotificationPayload): Promise<NotificationResult>;
    getChannelType(): NotificationType;
    isAvailable(): Promise<boolean>;
    validatePayload(payload: NotificationPayload): Promise<boolean>;
}

export interface NotificationPayload {
    recipient: string;
    subject?: string;
    content: string;
    templateName?: string;
    templateData?: Record<string, any>;
    attachments?: any[];
    metadata?: Record<string, any>;
}

export interface NotificationResult {
    success: boolean;
    messageId?: string;
    error?: string;
    sentAt?: Date;
}