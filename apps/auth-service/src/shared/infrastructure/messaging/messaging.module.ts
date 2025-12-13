import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ProducerService } from './producer.service';

@Global()
@Module({
    imports: [
        // Mendaftarkan Client Proxy untuk mengirim pesan
        ClientsModule.registerAsync([
            {
                name: 'AUTH_SERVICE_QUEUE', // Token Injection
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL')],
                        queue: configService.get<string>('RABBITMQ_QUEUE'),
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    providers: [ProducerService],
    exports: [ProducerService], // Export agar Use Case bisa pakai ProducerService
})
export class MessagingModule { }