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