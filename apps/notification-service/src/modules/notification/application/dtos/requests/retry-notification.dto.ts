// retry-notification.dto.ts
import { IsString } from 'class-validator';

export class RetryNotificationDto {
    @IsString()
    notificationId: string;
}