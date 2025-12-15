// notification-type.vo.ts
import { NotificationType } from '../enums/notification-type.enum';

export class NotificationTypeVO {
    private readonly value: NotificationType;

    constructor(type: NotificationType) {
        this.value = type;
    }

    getValue(): NotificationType {
        return this.value;
    }

    isEmail(): boolean {
        return this.value === NotificationType.EMAIL;
    }

    isSMS(): boolean {
        return this.value === NotificationType.SMS;
    }

    isWhatsApp(): boolean {
        return this.value === NotificationType.WHATSAPP;
    }
}