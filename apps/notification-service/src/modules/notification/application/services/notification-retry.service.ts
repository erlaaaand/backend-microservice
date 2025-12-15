// notification-retry.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { INotificationRepository } from '../../domain/ports/notification-repository.port';
import { QUEUE_NAMES, JOB_TYPES } from '../../../../shared/constants/queue.constants';

@Injectable()
export class NotificationRetryService {
    private readonly logger = new Logger(NotificationRetryService.name);

    constructor(
        private readonly notificationRepository: INotificationRepository,
        @InjectQueue(QUEUE_NAMES.RETRY) private readonly retryQueue: Queue,
    ) { }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async processFailedNotifications() {
        this.logger.log('Processing failed notifications for retry...');

        const failedNotifications = await this.notificationRepository.findFailedNotifications(50);

        for (const notification of failedNotifications) {
            if (notification.canRetry()) {
                await this.retryQueue.add(
                    JOB_TYPES.RETRY_NOTIFICATION,
                    { notificationId: notification.id },
                    {
                        attempts: notification.maxRetries - notification.retryCount,
                        backoff: {
                            type: 'exponential',
                            delay: 5000,
                        },
                    },
                );

                this.logger.log(`Queued notification ${notification.id} for retry`);
            }
        }

        this.logger.log(`Processed ${failedNotifications.length} failed notifications`);
    }
}