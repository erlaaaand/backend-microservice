
// notification-sent.event.ts
export class NotificationSentEvent {
    constructor(
        public readonly notificationId: string,
        public readonly userId: string,
        public readonly type: string,
        public readonly recipient: string,
        public readonly sentAt: Date,
    ) { }
}