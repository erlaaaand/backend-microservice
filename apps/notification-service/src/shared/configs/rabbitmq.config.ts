import { registerAs } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

export default registerAs(
    'rabbitmq',
    (): RmqOptions => ({
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
            queue: process.env.RABBITMQ_QUEUE || 'notification_queue',

            // Queue Options
            queueOptions: {
                durable: true,
                arguments: {
                    'x-message-ttl': 86400000, // 24 jam
                    'x-max-length': 10000,
                },
            },

            // Prefetch
            prefetchCount: parseInt(process.env.RABBITMQ_PREFETCH, 10) || 10,

            // Connection Options
            noAck: false,

            // Retry
            socketOptions: {
                heartbeatIntervalInSeconds: 60,
                reconnectTimeInSeconds: 5,
            },
        },
    }),
);