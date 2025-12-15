import { NotificationLogEntity } from '../entities/notification-log.entity';

// Ubah dari 'interface' ke 'abstract class'
export abstract class INotificationRepository {
    abstract create(notification: NotificationLogEntity): Promise<NotificationLogEntity>;
    abstract findById(id: string): Promise<NotificationLogEntity | null>;
    abstract findByUserId(userId: string, page: number, limit: number): Promise<{ data: NotificationLogEntity[]; total: number }>;
    abstract update(id: string, data: Partial<NotificationLogEntity>): Promise<NotificationLogEntity>;
    abstract delete(id: string): Promise<void>;
    abstract findFailedNotifications(limit: number): Promise<NotificationLogEntity[]>;
    abstract findByStatus(status: string): Promise<NotificationLogEntity[]>;
}