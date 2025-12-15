// consumers/payment-events.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { NotificationService } from '../../../../application/services/notification.service';
import { NotificationType } from '../../../../domain/enums/notification-type.enum';
import { NotificationPriority } from '../../../../domain/enums/notification-priority.enum';

@Controller()
export class PaymentEventsConsumer {
    private readonly logger = new Logger(PaymentEventsConsumer.name);

    constructor(private readonly notificationService: NotificationService) { }

    @EventPattern('payment.success')
    async handlePaymentSuccess(@Payload() data: any, @Ctx() context: RmqContext) {
        this.logger.log('Received payment.success event', data);

        try {
            const { userId, email, paymentId, amount, currency } = data;

            await this.notificationService.sendNotification({
                userId,
                type: NotificationType.EMAIL,
                recipient: email,
                subject: 'Payment Successful',
                content: `Your payment of ${currency} ${amount} has been processed successfully. Payment ID: ${paymentId}`,
                priority: NotificationPriority.HIGH,
                metadata: {
                    eventType: 'payment.success',
                    paymentId,
                    amount,
                    currency,
                },
            });

            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);

            this.logger.log(`Payment success email queued for payment: ${paymentId}`);
        } catch (error) {
            this.logger.error('Failed to process payment.success event', error.stack);

            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.nack(originalMsg, false, true); // Requeue
        }
    }

    @EventPattern('payment.failed')
    async handlePaymentFailed(@Payload() data: any, @Ctx() context: RmqContext) {
        this.logger.log('Received payment.failed event', data);

        try {
            const { userId, email, paymentId, errorReason } = data;

            await this.notificationService.sendNotification({
                userId,
                type: NotificationType.EMAIL,
                recipient: email,
                subject: 'Payment Failed',
                content: `Unfortunately, your payment could not be processed. Reason: ${errorReason}. Payment ID: ${paymentId}`,
                priority: NotificationPriority.HIGH,
                metadata: {
                    eventType: 'payment.failed',
                    paymentId,
                    errorReason,
                },
            });

            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.ack(originalMsg);

            this.logger.log(`Payment failed email queued for payment: ${paymentId}`);
        } catch (error) {
            this.logger.error('Failed to process payment.failed event', error.stack);

            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();
            channel.nack(originalMsg, false, true);
        }
    }
}