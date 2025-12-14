// apps/auth-service/src/modules/auth/application/event-handlers/publish-user-created.handler.ts

import { Injectable } from '@nestjs/common';
import { EventHandler } from '../../../../shared/domain/events/event-handler.interface';
import { UserRegisteredEvent } from '../../domain/events/user-registered.event';
import { ProducerService } from '../../../../shared/infrastructure/messaging/producer.service';
import { LoggerService } from '../../../../shared/infrastructure/logging/logger.service';

/**
 * Event Handler: Publish user created event to RabbitMQ
 * Mengirim event ke service lain (User Service, Notification Service, dll)
 */
@Injectable()
export class PublishUserCreatedHandler implements EventHandler<UserRegisteredEvent> {
    constructor(
        private readonly producer: ProducerService,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('PublishUserCreatedHandler');
    }

    async handle(event: UserRegisteredEvent): Promise<void> {
        this.logger.log('Publishing user.created event to RabbitMQ', {
            userId: event.userId,
        });

        try {
            // Publish event ke RabbitMQ
            this.producer.emit('user.created', event.getPayload());

            this.logger.log('User created event published successfully', {
                userId: event.userId,
            });
        } catch (error) {
            this.logger.error(
                'Failed to publish user created event',
                error.stack,
                { userId: event.userId }
            );
            // Don't throw error, agar tidak mengganggu flow utama
        }
    }
}