// send-email-notification.dto.ts
import { IsString, IsEmail, IsOptional, IsEnum, IsObject, IsDateString } from 'class-validator';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { NotificationPriority } from '../../../domain/enums/notification-priority.enum';

export class SendEmailNotificationDto {
    @IsString()
    userId: string;

    @IsEmail()
    recipient: string;

    @IsOptional()
    @IsString()
    subject?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    templateName?: string;

    @IsOptional()
    @IsObject()
    templateData?: Record<string, any>;

    @IsOptional()
    @IsEnum(NotificationPriority)
    priority?: NotificationPriority;

    @IsOptional()
    @IsDateString()
    scheduledAt?: string;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}