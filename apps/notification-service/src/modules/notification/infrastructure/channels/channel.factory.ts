// channel.factory.ts
import { Injectable } from '@nestjs/common';
import { INotificationChannel } from '../../domain/ports/notification-channel.port';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { EmailChannel } from './email/email.channel';

@Injectable()
export class ChannelFactory {
    constructor(private readonly emailChannel: EmailChannel) { }

    createChannel(type: NotificationType): INotificationChannel {
        switch (type) {
            case NotificationType.EMAIL:
                return this.emailChannel;
            default:
                throw new Error(`Channel type ${type} not supported`);
        }
    }
}