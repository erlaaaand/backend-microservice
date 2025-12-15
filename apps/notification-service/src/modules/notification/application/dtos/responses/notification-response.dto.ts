// notification-response.dto.ts
export class NotificationResponseDto {
    id: string;
    userId: string;
    type: string;
    recipient: string;
    subject?: string;
    status: string;
    priority: string;
    sentAt?: Date;
    failedAt?: Date;
    errorMessage?: string;
    retryCount: number;
    createdAt: Date;
}