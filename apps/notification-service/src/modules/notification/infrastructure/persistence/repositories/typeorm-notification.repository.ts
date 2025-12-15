import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationLogOrmEntity } from '../entities/notification-log.orm-entity';
import { INotificationRepository } from '../../../domain/ports/notification-repository.port';
import { NotificationLogEntity } from '../../../domain/entities/notification-log.entity';
import { NotificationStatus } from '../../../domain/enums/notification-status.enum';

@Injectable()
export class TypeOrmNotificationRepository implements INotificationRepository {
    constructor(
        @InjectRepository(NotificationLogOrmEntity)
        private readonly repository: Repository<NotificationLogOrmEntity>,
    ) { }

    async create(notification: NotificationLogEntity): Promise<NotificationLogEntity> {
        const ormEntity = this.repository.create(notification);
        const saved = await this.repository.save(ormEntity);
        return this.toDomain(saved);
    }

    async findById(id: string): Promise<NotificationLogEntity | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }

    async findByUserId(
        userId: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<{ data: NotificationLogEntity[]; total: number }> {
        const [entities, total] = await this.repository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: entities.map((e) => this.toDomain(e)),
            total,
        };
    }

    async update(
        id: string,
        data: Partial<NotificationLogEntity>,
    ): Promise<NotificationLogEntity> {
        await this.repository.update(id, data as any);
        const updated = await this.repository.findOne({ where: { id } });
        if (!updated) throw new Error('Notification not found after update');
        return this.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async findFailedNotifications(limit: number = 100): Promise<NotificationLogEntity[]> {
        const entities = await this.repository.find({
            where: { status: NotificationStatus.FAILED },
            order: { failedAt: 'ASC' },
            take: limit,
        });
        return entities.map((e) => this.toDomain(e));
    }

    async findByStatus(status: string): Promise<NotificationLogEntity[]> {
        const entities = await this.repository.find({
            where: { status: status as NotificationStatus },
            order: { createdAt: 'DESC' },
        });
        return entities.map((e) => this.toDomain(e));
    }

    private toDomain(entity: NotificationLogOrmEntity): NotificationLogEntity {
        return new NotificationLogEntity({
            id: entity.id,
            userId: entity.userId,
            type: entity.type,
            channel: entity.channel,
            recipient: entity.recipient,
            subject: entity.subject,
            content: entity.content,
            templateName: entity.templateName,
            templateData: entity.templateData,
            status: entity.status,
            priority: entity.priority,
            scheduledAt: entity.scheduledAt,
            sentAt: entity.sentAt,
            failedAt: entity.failedAt,
            errorMessage: entity.errorMessage,
            retryCount: entity.retryCount,
            maxRetries: entity.maxRetries,
            metadata: entity.metadata,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}