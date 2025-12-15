// order-events.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { NotificationService } from '../../../../application/services/notification.service';

@Controller()
export class OrderEventsConsumer {
    private readonly logger = new Logger(OrderEventsConsumer.name);

    constructor(private readonly notificationService: NotificationService) { }

    @EventPattern('order.completed')
    async handleOrderCompleted(@Payload() data: any, @Ctx() context: RmqContext) {
        this.logger.log('Received order.completed event', data);

        try {
            const { userId, email, orderId, items, total } = data;

            await this.notificationService.sendNotification({
                userId,
                type: 'email' as any,
                recipient: email,
                subject: `Order Confirmation - ${orderId}`,
                templateName: 'order-confirmation',
                templateData: {
                    userName: email.split('@')[0],
                    orderId,
                    items,
                    total,
                    appName: 'My App',
                },
                priority: 'normal' as any,
            });

            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);
        } catch (error) {
            this.logger.error('Failed to send order confirmation', error.stack);

            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.nack(originalMsg, false, false); // Don't requeue
        }
    }
}