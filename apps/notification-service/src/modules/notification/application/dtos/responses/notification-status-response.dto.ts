// notification-status-response.dto.ts
export class NotificationStatusResponseDto {
    id: string;
    status: string;
    sentAt?: Date;
    failedAt?: Date;
    errorMessage?: string;
    retryCount: number;
    canRetry: boolean;
}