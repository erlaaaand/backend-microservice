// get-notification-history.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationLogEntity } from '../../domain/entities/notification-log.entity';

@Injectable()
export class GetNotificationHistoryUseCase {
    private readonly logger = new Logger(GetNotificationHistoryUseCase.name);

    constructor(private readonly notificationService: NotificationService) { }

    async execute(
        userId: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ data: NotificationLogEntity[]; total: number; page: number; limit: number }> {
        this.logger.log(`Getting notification history for user: ${userId}, page: ${page}`);

        const result = await this.notificationService.getUserNotifications(userId, page, limit);

        return {
            ...result,
            page,
            limit,
        };
    }
}