import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

// Entities
import { NotificationLogOrmEntity } from './infrastructure/persistence/entities/notification-log.orm-entity';

// Controllers (HTTP)
import { NotificationController } from './presentation/controllers/notification.controller';
import { NotificationAdminController } from './presentation/controllers/notification-admin.controller';

// Consumers (RabbitMQ)
import { UserEventsConsumer } from './infrastructure/messaging/rabbitmq/consumers/user-events.consumer';
import { OrderEventsConsumer } from './infrastructure/messaging/rabbitmq/consumers/order-events.consumer';
import { PaymentEventsConsumer } from './infrastructure/messaging/rabbitmq/consumers/payment-events.consumer';

// Services
import { NotificationService } from './application/services/notification.service';
import { NotificationRetryService } from './application/services/notification-retry.service';
import { NotificationThrottlerService } from './application/services/notification-throttler.service';
import { ReminderScheduler } from './application/services/reminder.scheduler';

// Use Cases
import { SendNotificationUseCase } from './application/use-cases/send-notification.use-case';
import { SendBatchNotificationsUseCase } from './application/use-cases/send-batch-notifications.use-case';
import { GetNotificationStatusUseCase } from './application/use-cases/get-notification-status.use-case';
import { GetNotificationHistoryUseCase } from './application/use-cases/get-notification-history.use-case';
import { CancelScheduledNotificationUseCase } from './application/use-cases/cancel-scheduled-notification.use-case';
import { RetryFailedNotificationUseCase } from './application/use-cases/retry-failed-notification.use-case';

// Event Handlers (Internal Events)
import { UserRegisteredHandler } from './application/event-handlers/user-registered.handler';
import { PaymentSuccessHandler } from './application/event-handlers/payment-success.handler';
import { OrderCompletedHandler } from './application/event-handlers/order-completed.handler';
import { PasswordResetRequestedHandler } from './application/event-handlers/password-reset-requested.handler';

// Repositories
import { TypeOrmNotificationRepository } from './infrastructure/persistence/repositories/typeorm-notification.repository';
import { INotificationRepository } from './domain/ports/notification-repository.port';

// Cache
import { RedisCacheAdapter } from './infrastructure/cache/redis-cache.adapter';
import { ICacheService } from './domain/ports/cache.port';

// Channels
import { EmailChannel } from './infrastructure/channels/email/email.channel';
import { ChannelFactory } from './infrastructure/channels/channel.factory';
import { ChannelSelectorService } from './infrastructure/channels/channel-selector.service';

// Processors (Bull Queue)
import { NotificationProcessor } from './infrastructure/queues/notification.processor';
import { BatchNotificationProcessor } from './infrastructure/queues/batch-notification.processor';
import { RetryProcessor } from './infrastructure/queues/retry.processor';
import { DeadLetterProcessor } from './infrastructure/queues/dead-letter.processor';
import { QueueMonitorService } from './infrastructure/queues/queue-monitor.service';
import { QueueEventsListener } from './infrastructure/queues/queue-events.listener';

// Monitoring
import { NotificationMetrics } from '../../shared/monitoring/metrics/notification.metrics';
import { QueueMetricsCollector } from '../../shared/monitoring/metrics/queue.metrics';
import { AlertService } from '../../shared/monitoring/alerts/alert.service';
import { AlertRules } from '../../shared/monitoring/alerts/alert-rules';

// Constants
import { QUEUE_NAMES } from '../../shared/constants/queue.constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([NotificationLogOrmEntity]),

        // BullMQ Queues Registration
        BullModule.registerQueue(
            { name: QUEUE_NAMES.NOTIFICATION },
            { name: QUEUE_NAMES.BATCH_NOTIFICATION },
            { name: QUEUE_NAMES.RETRY },
            { name: QUEUE_NAMES.DEAD_LETTER },
        ),

        // RabbitMQ Client Registration (untuk publish event balik jika perlu)
        ClientsModule.registerAsync([
            {
                name: 'RABBITMQ_SERVICE',
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: configService.get('rabbitmq').options,
                }),
            },
        ]),
    ],
    controllers: [
        // HTTP Endpoints
        NotificationController,
        NotificationAdminController,

        // RabbitMQ Consumers (di NestJS Microservice, consumer dianggap controller)
        UserEventsConsumer,
        OrderEventsConsumer,
        PaymentEventsConsumer,
    ],
    providers: [
        // --- Application Services ---
        NotificationService,
        NotificationRetryService,
        NotificationThrottlerService,
        ReminderScheduler,

        // --- Use Cases ---
        SendNotificationUseCase,
        SendBatchNotificationsUseCase,
        GetNotificationStatusUseCase,
        GetNotificationHistoryUseCase,
        CancelScheduledNotificationUseCase,
        RetryFailedNotificationUseCase,

        // --- Event Handlers (Domain/Application Events) ---
        UserRegisteredHandler,
        PaymentSuccessHandler,
        OrderCompletedHandler,
        PasswordResetRequestedHandler,

        // --- Infrastructure ---
        {
            provide: INotificationRepository, // Sekarang ini valid karena INotificationRepository adalah class
            useClass: TypeOrmNotificationRepository,
        },
        {
            provide: ICacheService, // Ini juga valid
            useClass: RedisCacheAdapter,
        },
        RedisCacheAdapter, // Provider direct access jika perlu

        // Channels
        EmailChannel,
        ChannelFactory,
        ChannelSelectorService,

        // Queue Processors & Listeners
        NotificationProcessor,
        BatchNotificationProcessor,
        RetryProcessor,
        DeadLetterProcessor,
        QueueMonitorService,
        QueueEventsListener,

        // Monitoring & Metrics
        NotificationMetrics,
        QueueMetricsCollector,
        AlertService,
        AlertRules,
    ],
    exports: [NotificationService],
})
export class NotificationModule { }