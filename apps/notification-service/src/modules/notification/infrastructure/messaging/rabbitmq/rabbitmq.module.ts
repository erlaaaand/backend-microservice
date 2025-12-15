// rabbitmq.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

// Consumers
import { UserEventsConsumer } from './consumers/user-events.consumer';
import { OrderEventsConsumer } from './consumers/order-events.consumer';
import { PaymentEventsConsumer } from './consumers/payment-events.consumer';

// Publishers
import { NotificationEventsPublisher } from './publishers/notification-events.publisher';

@Module({
    imports: [
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
    controllers: [UserEventsConsumer, OrderEventsConsumer, PaymentEventsConsumer],
    providers: [NotificationEventsPublisher],
    exports: [NotificationEventsPublisher],
})
export class RabbitMQModule { }