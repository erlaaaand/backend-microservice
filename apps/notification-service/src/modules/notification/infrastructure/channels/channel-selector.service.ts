// channel-selector.service.ts
import { Injectable } from '@nestjs/common';
import { INotificationChannel } from '../../domain/ports/notification-channel.port';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { ChannelUnavailableException } from '../../domain/exceptions/channel-unavailable.exception';
import { EmailChannel } from './email/email.channel';

@Injectable()
export class ChannelSelectorService {
    constructor(private readonly emailChannel: EmailChannel) { }

    async selectChannel(type: NotificationType): Promise<INotificationChannel> {
        let channel: INotificationChannel;

        switch (type) {
            case NotificationType.EMAIL:
                channel = this.emailChannel;
                break;
            case NotificationType.SMS:
                // TODO: Implement SMS channel
                throw new ChannelUnavailableException('SMS');
            case NotificationType.WHATSAPP:
                // TODO: Implement WhatsApp channel
                throw new ChannelUnavailableException('WhatsApp');
            default:
                throw new ChannelUnavailableException(type);
        }

        const isAvailable = await channel.isAvailable();
        if (!isAvailable) {
            throw new ChannelUnavailableException(type);
        }

        return channel;
    }
}