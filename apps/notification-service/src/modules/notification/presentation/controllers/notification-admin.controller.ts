// notification-admin.controller.ts
import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { JobStatus, Queue } from 'bull';
import { ApiKeyGuard } from '../../../../shared/guards/api-key.guard';
import { QUEUE_NAMES } from '../../../../shared/constants/queue.constants';
import { INotificationRepository } from '../../domain/ports/notification-repository.port';

@Controller('admin/notifications')
@UseGuards(ApiKeyGuard)
export class NotificationAdminController {
    constructor(
        private readonly notificationRepository: INotificationRepository,
        @InjectQueue(QUEUE_NAMES.NOTIFICATION) private readonly notificationQueue: Queue,
    ) { }

    @Get('stats')
    async getStats() {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            this.notificationQueue.getWaitingCount(),
            this.notificationQueue.getActiveCount(),
            this.notificationQueue.getCompletedCount(),
            this.notificationQueue.getFailedCount(),
            this.notificationQueue.getDelayedCount(),
        ]);

        return {
            queue: {
                waiting,
                active,
                completed,
                failed,
                delayed,
                total: waiting + active + completed + failed + delayed,
            },
        };
    }

    @Get('failed')
    async getFailedNotifications(@Query('limit') limit: number = 50) {
        return this.notificationRepository.findFailedNotifications(limit);
    }

    @Get('queue/jobs')
    async getQueueJobs(@Query('status') status: string = 'waiting') {
        const jobs = await this.notificationQueue.getJobs([status as JobStatus], 0, 100);
        return jobs.map((job) => ({
            id: job.id,
            data: job.data,
            attemptsMade: job.attemptsMade,
            timestamp: job.timestamp,
            processedOn: job.processedOn,
            finishedOn: job.finishedOn,
        }));
    }
}