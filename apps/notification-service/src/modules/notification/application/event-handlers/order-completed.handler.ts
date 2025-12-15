// order-completed.handler.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { NotificationPriority } from '../../domain/enums/notification-priority.enum';

interface OrderCompletedEvent {
    userId: string;
    email: string;
    orderId: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    timestamp: Date;
}

@Injectable()
export class OrderCompletedHandler {
    private readonly logger = new Logger(OrderCompletedHandler.name);

    constructor(private readonly notificationService: NotificationService) { }

    @OnEvent('order.completed')
    async handle(event: OrderCompletedEvent) {
        this.logger.log(`Handling order.completed event for order: ${event.orderId}`);

        try {
            await this.notificationService.sendNotification({
                userId: event.userId,
                type: NotificationType.EMAIL,
                recipient: event.email,
                subject: `Order Confirmation - ${event.orderId}`,
                templateName: 'order-confirmation',
                templateData: {
                    userName: event.email.split('@')[0],
                    orderId: event.orderId,
                    items: event.items,
                    total: event.total,
                    appName: 'My App',
                },
                priority: NotificationPriority.NORMAL,
                metadata: {
                    eventType: 'order.completed',
                    orderId: event.orderId,
                    timestamp: event.timestamp,
                },
            });

            this.logger.log(`Order confirmation email queued for order: ${event.orderId}`);
        } catch (error) {
            this.logger.error(`Failed to send order confirmation: ${error.message}`, error.stack);
        }
    }
}