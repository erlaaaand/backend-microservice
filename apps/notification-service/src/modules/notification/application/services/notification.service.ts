import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';
import { INotificationRepository } from '../../domain/ports/notification-repository.port';
import { NotificationLogEntity } from '../../domain/entities/notification-log.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { NotificationPriority } from '../../domain/enums/notification-priority.enum';
import { QUEUE_NAMES, JOB_TYPES, QUEUE_PRIORITIES } from '../../../../shared/constants/queue.constants';
import { ICacheService } from '../../domain/ports/cache.port';
import { CACHE_KEYS, CACHE_TTL } from '../../../../shared/constants/cache.constants';

export interface SendNotificationDto {
    userId: string;
    type: NotificationType;
    recipient: string;
    subject?: string;
    content?: string;
    templateName?: string;
    templateData?: Record<string, any>;
    priority?: NotificationPriority;
    scheduledAt?: Date;
    metadata?: Record<string, any>;
}

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly notificationRepository: INotificationRepository,
        private readonly cacheService: ICacheService,
        @InjectQueue(QUEUE_NAMES.NOTIFICATION) private readonly notificationQueue: Queue,
    ) { }

    async sendNotification(dto: SendNotificationDto): Promise<NotificationLogEntity> {
        this.logger.log(`Creating notification for user ${dto.userId}`);

        // Create notification log
        const notification = new NotificationLogEntity({
            id: uuidv4(),
            userId: dto.userId,
            type: dto.type,
            channel: dto.type.toString(),
            recipient: dto.recipient,
            subject: dto.subject,
            content: dto.content || '',
            templateName: dto.templateName,
            templateData: dto.templateData,
            status: NotificationStatus.PENDING,
            priority: dto.priority || NotificationPriority.NORMAL,
            scheduledAt: dto.scheduledAt,
            metadata: dto.metadata,
            retryCount: 0,
            maxRetries: 3,
        });

        // Save to database
        const saved = await this.notificationRepository.create(notification);

        // Prepare payload
        const payload = {
            recipient: dto.recipient,
            subject: dto.subject,
            content: dto.content,
            templateName: dto.templateName,
            templateData: dto.templateData,
        };

        // Add to queue
        const jobOptions = {
            priority: this.getPriorityValue(dto.priority || NotificationPriority.NORMAL),
            delay: dto.scheduledAt ? dto.scheduledAt.getTime() - Date.now() : 0,
            attempts: 3,
            backoff: {
                type: 'exponential' as const,
                delay: 2000,
            },
        };

        await this.notificationQueue.add(
            JOB_TYPES.SEND_EMAIL,
            {
                notificationId: saved.id,
                payload,
            },
            jobOptions,
        );

        // Update status to queued
        await this.notificationRepository.update(saved.id, {
            status: NotificationStatus.QUEUED,
        });

        this.logger.log(`Notification ${saved.id} queued successfully`);

        return saved;
    }

    async getNotificationStatus(notificationId: string): Promise<NotificationLogEntity | null> {
        // Check cache first
        const cacheKey = CACHE_KEYS.NOTIFICATION_STATUS(notificationId);
        const cached = await this.cacheService.get<NotificationLogEntity>(cacheKey);

        if (cached) {
            return cached;
        }

        // Get from database
        const notification = await this.notificationRepository.findById(notificationId);

        if (notification) {
            // Cache for 5 minutes
            await this.cacheService.set(cacheKey, notification, CACHE_TTL.SHORT);
        }

        return notification;
    }

    async getUserNotifications(
        userId: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ data: NotificationLogEntity[]; total: number }> {
        return this.notificationRepository.findByUserId(userId, page, limit);
    }

    async retryNotification(notificationId: string): Promise<void> {
        const notification = await this.notificationRepository.findById(notificationId);

        if (!notification) {
            throw new Error('Notification not found');
        }

        if (!notification.canRetry()) {
            throw new Error('Notification cannot be retried');
        }

        // Increment retry count
        await this.notificationRepository.update(notificationId, {
            retryCount: notification.retryCount + 1,
            status: NotificationStatus.RETRY,
        });

        // Re-add to queue
        const payload = {
            recipient: notification.recipient,
            subject: notification.subject,
            content: notification.content,
            templateName: notification.templateName,
            templateData: notification.templateData,
        };

        await this.notificationQueue.add(
            JOB_TYPES.SEND_EMAIL,
            {
                notificationId: notification.id,
                payload,
            },
            {
                priority: QUEUE_PRIORITIES.HIGH,
                attempts: notification.maxRetries - notification.retryCount,
            },
        );

        this.logger.log(`Notification ${notificationId} queued for retry`);
    }

    async cancelNotification(notificationId: string): Promise<void> {
        const notification = await this.notificationRepository.findById(notificationId);

        if (!notification) {
            throw new Error('Notification not found');
        }

        const statusVO = new (require('../../domain/value-objects/notification-status.vo').NotificationStatusVO)(notification.status);

        if (!statusVO.canCancel()) {
            throw new Error('Notification cannot be cancelled');
        }

        await this.notificationRepository.update(notificationId, {
            status: NotificationStatus.CANCELLED,
        });

        // Remove from queue if exists
        const jobs = await this.notificationQueue.getJobs(['waiting', 'delayed']);
        const job = jobs.find((j) => j.data.notificationId === notificationId);

        if (job) {
            await job.remove();
            this.logger.log(`Removed job for notification ${notificationId} from queue`);
        }
    }

    private getPriorityValue(priority: NotificationPriority): number {
        const priorityMap = {
            [NotificationPriority.CRITICAL]: QUEUE_PRIORITIES.CRITICAL,
            [NotificationPriority.HIGH]: QUEUE_PRIORITIES.HIGH,
            [NotificationPriority.NORMAL]: QUEUE_PRIORITIES.NORMAL,
            [NotificationPriority.LOW]: QUEUE_PRIORITIES.LOW,
        };
        return priorityMap[priority];
    }
}