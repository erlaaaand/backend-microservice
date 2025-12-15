import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationPriority } from '../enums/notification-priority.enum';

export class NotificationLogEntity {
    id: string;
    userId: string;
    type: NotificationType;
    channel: string;
    recipient: string;
    subject?: string;
    content: string;
    templateName?: string;
    templateData?: Record<string, any>;
    status: NotificationStatus;
    priority: NotificationPriority;
    scheduledAt?: Date;
    sentAt?: Date;
    failedAt?: Date;
    errorMessage?: string;
    retryCount: number;
    maxRetries: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<NotificationLogEntity>) {
        Object.assign(this, partial);
        this.retryCount = partial.retryCount || 0;
        this.maxRetries = partial.maxRetries || 3;
        this.createdAt = partial.createdAt || new Date();
        this.updatedAt = partial.updatedAt || new Date();
    }

    // Domain Methods
    markAsSent(): void {
        this.status = NotificationStatus.SENT;
        this.sentAt = new Date();
        this.updatedAt = new Date();
    }

    markAsFailed(errorMessage: string): void {
        this.status = NotificationStatus.FAILED;
        this.failedAt = new Date();
        this.errorMessage = errorMessage;
        this.updatedAt = new Date();
    }

    incrementRetry(): void {
        this.retryCount += 1;
        this.updatedAt = new Date();
    }

    canRetry(): boolean {
        return this.retryCount < this.maxRetries && this.status === NotificationStatus.FAILED;
    }

    isExpired(): boolean {
        if (!this.scheduledAt) return false;
        const expiryTime = new Date(this.scheduledAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        return new Date() > expiryTime;
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            type: this.type,
            channel: this.channel,
            recipient: this.recipient,
            subject: this.subject,
            status: this.status,
            priority: this.priority,
            sentAt: this.sentAt,
            failedAt: this.failedAt,
            errorMessage: this.errorMessage,
            retryCount: this.retryCount,
            createdAt: this.createdAt,
        };
    }
}