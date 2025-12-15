// notification-payload.interface.ts
import { NotificationType } from '../../modules/notification/domain/enums/notification-type.enum';
import { NotificationPriority } from '../../modules/notification/domain/enums/notification-priority.enum';

export interface INotificationPayload {
    userId: string;
    type: NotificationType;
    recipient: string;
    subject?: string;
    content?: string;
    templateName?: string;
    templateData?: Record<string, any>;
    priority?: NotificationPriority;
    scheduledAt?: Date;
    metadata?: Record<string, any>;
}