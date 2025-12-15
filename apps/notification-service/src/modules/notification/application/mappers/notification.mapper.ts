// notification.mapper.ts
import { NotificationLogEntity } from '../../domain/entities/notification-log.entity';
import { NotificationResponseDto } from '../dtos/responses/notification-response.dto';
import { NotificationStatusResponseDto } from '../dtos/responses/notification-status-response.dto';

export class NotificationMapper {
    static toResponseDto(entity: NotificationLogEntity): NotificationResponseDto {
        return {
            id: entity.id,
            userId: entity.userId,
            type: entity.type,
            recipient: entity.recipient,
            subject: entity.subject,
            status: entity.status,
            priority: entity.priority,
            sentAt: entity.sentAt,
            failedAt: entity.failedAt,
            errorMessage: entity.errorMessage,
            retryCount: entity.retryCount,
            createdAt: entity.createdAt,
        };
    }

    static toStatusResponseDto(entity: NotificationLogEntity): NotificationStatusResponseDto {
        return {
            id: entity.id,
            status: entity.status,
            sentAt: entity.sentAt,
            failedAt: entity.failedAt,
            errorMessage: entity.errorMessage,
            retryCount: entity.retryCount,
            canRetry: entity.canRetry(),
        };
    }

    static toResponseDtoList(entities: NotificationLogEntity[]): NotificationResponseDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
    }
}