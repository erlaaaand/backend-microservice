// notification-status.vo.ts
import { NotificationStatus } from '../enums/notification-status.enum';

export class NotificationStatusVO {
    private readonly value: NotificationStatus;

    constructor(status: NotificationStatus) {
        this.value = status;
    }

    getValue(): NotificationStatus {
        return this.value;
    }

    isPending(): boolean {
        return this.value === NotificationStatus.PENDING;
    }

    isProcessing(): boolean {
        return this.value === NotificationStatus.PROCESSING;
    }

    isSent(): boolean {
        return this.value === NotificationStatus.SENT;
    }

    isFailed(): boolean {
        return this.value === NotificationStatus.FAILED;
    }

    canRetry(): boolean {
        return [NotificationStatus.FAILED, NotificationStatus.RETRY].includes(this.value);
    }

    canCancel(): boolean {
        return [NotificationStatus.PENDING, NotificationStatus.QUEUED].includes(this.value);
    }
}