// payment-success.handler.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { NotificationPriority } from '../../domain/enums/notification-priority.enum';

interface PaymentSuccessEvent {
    userId: string;
    email: string;
    paymentId: string;
    amount: number;
    currency: string;
    timestamp: Date;
}

@Injectable()
export class PaymentSuccessHandler {
    private readonly logger = new Logger(PaymentSuccessHandler.name);

    constructor(private readonly notificationService: NotificationService) { }

    @OnEvent('payment.success')
    async handle(event: PaymentSuccessEvent) {
        this.logger.log(`Handling payment.success event for payment: ${event.paymentId}`);

        try {
            await this.notificationService.sendNotification({
                userId: event.userId,
                type: NotificationType.EMAIL,
                recipient: event.email,
                subject: 'Payment Successful',
                content: `Your payment of ${event.currency} ${event.amount} has been processed successfully.`,
                priority: NotificationPriority.HIGH,
                metadata: {
                    eventType: 'payment.success',
                    paymentId: event.paymentId,
                    amount: event.amount,
                    currency: event.currency,
                    timestamp: event.timestamp,
                },
            });

            this.logger.log(`Payment success email queued for payment: ${event.paymentId}`);
        } catch (error) {
            this.logger.error(`Failed to send payment success email: ${error.message}`, error.stack);
        }
    }
}