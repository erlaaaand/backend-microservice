// batch-notification.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAMES, JOB_TYPES } from '../../../../shared/constants/queue.constants';
import { EmailChannel } from '../channels/email/email.channel';

@Processor(QUEUE_NAMES.BATCH_NOTIFICATION)
export class BatchNotificationProcessor {
    private readonly logger = new Logger(BatchNotificationProcessor.name);

    constructor(private readonly emailChannel: EmailChannel) { }

    @Process(JOB_TYPES.SEND_BATCH)
    async handleBatchSend(job: Job) {
        this.logger.log(`Processing batch job ${job.id} with ${job.data.notifications.length} items`);

        const { notifications } = job.data;
        const results = {
            success: 0,
            failed: 0,
            total: notifications.length,
        };

        for (const notification of notifications) {
            try {
                const result = await this.emailChannel.send(notification.payload);

                if (result.success) {
                    results.success++;
                } else {
                    results.failed++;
                }

                // Update progress
                job.progress((results.success + results.failed) / results.total * 100);
            } catch (error) {
                this.logger.error(`Failed to send batch item: ${error.message}`);
                results.failed++;
            }
        }

        this.logger.log(`Batch job ${job.id} completed. Success: ${results.success}, Failed: ${results.failed}`);
        return results;
    }
}