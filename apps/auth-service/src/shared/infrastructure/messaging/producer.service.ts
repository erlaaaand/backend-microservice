import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProducerService {
    constructor(@Inject('AUTH_SERVICE_QUEUE') private readonly client: ClientProxy) { }

    /**
     * Mengirim event ke RabbitMQ (Fire and Forget)
     * @param pattern Nama event (misal: 'user.registered')
     * @param data Data yang dikirim (Payload)
     */
    emit(pattern: string, data: any) {
        this.client.emit(pattern, data);
    }
}