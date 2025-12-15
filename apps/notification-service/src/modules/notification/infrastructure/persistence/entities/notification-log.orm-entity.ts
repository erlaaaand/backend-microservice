import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { NotificationStatus } from '../../../domain/enums/notification-status.enum';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { NotificationPriority } from '../../../domain/enums/notification-priority.enum';

@Entity('notification_logs')
@Index(['userId', 'createdAt'])
@Index(['status', 'createdAt'])
@Index(['type', 'status'])
export class NotificationLogOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    @Index()
    userId: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.EMAIL,
    })
    type: NotificationType;

    @Column({ type: 'varchar', length: 50 })
    channel: string;

    @Column({ type: 'varchar', length: 255 })
    @Index()
    recipient: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    subject: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    templateName: string;

    @Column({ type: 'json', nullable: true })
    templateData: Record<string, any>;

    @Column({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.PENDING,
    })
    @Index()
    status: NotificationStatus;

    @Column({
        type: 'enum',
        enum: NotificationPriority,
        default: NotificationPriority.NORMAL,
    })
    priority: NotificationPriority;

    @Column({ type: 'timestamp', nullable: true })
    scheduledAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    sentAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    failedAt: Date;

    @Column({ type: 'text', nullable: true })
    errorMessage: string;

    @Column({ type: 'int', default: 0 })
    retryCount: number;

    @Column({ type: 'int', default: 3 })
    maxRetries: number;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}