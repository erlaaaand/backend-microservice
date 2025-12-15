// publishers/notification-events.publisher.ts
import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '../../../../domain/ports/event-publisher.port';

@Injectable()
export class NotificationEventsPublisher implements IEventPublisher {
    private readonly logger = new Logger(NotificationEventsPublisher.name);

    constructor(@Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy) { }

    async publish(pattern: string, data: any): Promise<void> {
        try {
            this.logger.log(`Publishing event: ${pattern}`, data);

            await this.client.emit(pattern, data).toPromise();

            this.logger.log(`Event ${pattern} published successfully`);
        } catch (error) {
            this.logger.error(`Failed to publish event ${pattern}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async publishBatch(events: Array<{ pattern: string; data: any }>): Promise<void> {
        try {
            this.logger.log(`Publishing batch of ${events.length} events`);

            await Promise.all(
                events.map((event) => this.client.emit(event.pattern, event.data).toPromise()),
            );

            this.logger.log(`Batch of ${events.length} events published successfully`);
        } catch (error) {
            this.logger.error(`Failed to publish batch events: ${error.message}`, error.stack);
            throw error;
        }
    }

    // Convenience methods for common events
    async publishNotificationSent(data: {
        notificationId: string;
        userId: string;
        type: string;
        recipient: string;
        sentAt: Date;
    }): Promise<void> {
        await this.publish('notification.sent', data);
    }

    async publishNotificationFailed(data: {
        notificationId: string;
        userId: string;
        error: string;
        retryCount: number;
    }): Promise<void> {
        await this.publish('notification.failed', data);
    }

    async publishNotificationRetried(data: {
        notificationId: string;
        userId: string;
        retryAttempt: number;
    }): Promise<void> {
        await this.publish('notification.retried', data);
    }
}
