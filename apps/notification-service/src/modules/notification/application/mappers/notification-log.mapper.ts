// notification-log.mapper.ts
import { NotificationLogEntity } from '../../domain/entities/notification-log.entity';
import { NotificationLogOrmEntity } from '../../infrastructure/persistence/entities/notification-log.orm-entity';

export class NotificationLogMapper {
    static toDomain(ormEntity: NotificationLogOrmEntity): NotificationLogEntity {
        return new NotificationLogEntity({
            id: ormEntity.id,
            userId: ormEntity.userId,
            type: ormEntity.type,
            channel: ormEntity.channel,
            recipient: ormEntity.recipient,
            subject: ormEntity.subject,
            content: ormEntity.content,
            templateName: ormEntity.templateName,
            templateData: ormEntity.templateData,
            status: ormEntity.status,
            priority: ormEntity.priority,
            scheduledAt: ormEntity.scheduledAt,
            sentAt: ormEntity.sentAt,
            failedAt: ormEntity.failedAt,
            errorMessage: ormEntity.errorMessage,
            retryCount: ormEntity.retryCount,
            maxRetries: ormEntity.maxRetries,
            metadata: ormEntity.metadata,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
        });
    }

    static toOrm(entity: NotificationLogEntity): NotificationLogOrmEntity {
        const ormEntity = new NotificationLogOrmEntity();

        ormEntity.id = entity.id;
        ormEntity.userId = entity.userId;
        ormEntity.type = entity.type;
        ormEntity.channel = entity.channel;
        ormEntity.recipient = entity.recipient;
        ormEntity.subject = entity.subject;
        ormEntity.content = entity.content;
        ormEntity.templateName = entity.templateName;
        ormEntity.templateData = entity.templateData;
        ormEntity.status = entity.status;
        ormEntity.priority = entity.priority;
        ormEntity.scheduledAt = entity.scheduledAt;
        ormEntity.sentAt = entity.sentAt;
        ormEntity.failedAt = entity.failedAt;
        ormEntity.errorMessage = entity.errorMessage;
        ormEntity.retryCount = entity.retryCount;
        ormEntity.maxRetries = entity.maxRetries;
        ormEntity.metadata = entity.metadata;
        ormEntity.createdAt = entity.createdAt;
        ormEntity.updatedAt = entity.updatedAt;

        return ormEntity;
    }

    static toDomainList(ormEntities: NotificationLogOrmEntity[]): NotificationLogEntity[] {
        return ormEntities.map((ormEntity) => this.toDomain(ormEntity));
    }

    static toOrmList(entities: NotificationLogEntity[]): NotificationLogOrmEntity[] {
        return entities.map((entity) => this.toOrm(entity));
    }
}