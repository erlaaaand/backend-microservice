// reminder.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAMES, JOB_TYPES } from '../../../../shared/constants/queue.constants';

@Injectable()
export class ReminderScheduler {
    private readonly logger = new Logger(ReminderScheduler.name);

    constructor(
        @InjectQueue(QUEUE_NAMES.NOTIFICATION) private readonly notificationQueue: Queue,
    ) { }

    async scheduleReminder(
        notificationId: string,
        payload: any,
        scheduledAt: Date,
    ): Promise<void> {
        const delay = scheduledAt.getTime() - Date.now();

        if (delay <= 0) {
            throw new Error('Scheduled time must be in the future');
        }

        await this.notificationQueue.add(
            JOB_TYPES.SEND_REMINDER,
            { notificationId, payload },
            { delay },
        );

        this.logger.log(`Reminder scheduled for ${scheduledAt.toISOString()}`);
    }

    async cancelReminder(notificationId: string): Promise<void> {
        const jobs = await this.notificationQueue.getJobs(['delayed', 'waiting']);
        const job = jobs.find((j) => j.data.notificationId === notificationId);

        if (job) {
            await job.remove();
            this.logger.log(`Cancelled reminder for notification ${notificationId}`);
        }
    }
}