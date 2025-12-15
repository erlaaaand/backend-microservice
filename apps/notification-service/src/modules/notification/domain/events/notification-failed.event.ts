// notification-failed.event.ts
export class NotificationFailedEvent {
    constructor(
        public readonly notificationId: string,
        public readonly userId: string,
        public readonly type: string,
        public readonly recipient: string,
        public readonly error: string,
        public readonly retryCount: number,
        public readonly failedAt: Date,
    ) { }
}