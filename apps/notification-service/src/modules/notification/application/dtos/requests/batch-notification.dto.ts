// batch-notification.dto.ts
import { IsArray, ValidateNested, ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { SendEmailNotificationDto } from './send-email-notification.dto';

export class BatchNotificationDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SendEmailNotificationDto)
    @ArrayMinSize(1)
    @ArrayMaxSize(100)
    notifications: SendEmailNotificationDto[];
}

// schedule-reminder.dto.ts
import { IsString, IsDateString, IsObject } from 'class-validator';

export class ScheduleReminderDto {
    @IsString()
    userId: string;

    @IsString()
    recipient: string;

    @IsString()
    reminderTitle: string;

    @IsString()
    reminderMessage: string;

    @IsDateString()
    scheduledDate: string;

    @IsObject()
    metadata?: Record<string, any>;
}
