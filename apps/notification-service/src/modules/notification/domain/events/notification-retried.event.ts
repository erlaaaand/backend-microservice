// notification-retried.event.ts
export class NotificationRetriedEvent {
    constructor(
        public readonly notificationId: string,
        public readonly userId: string,
        public readonly retryAttempt: number,
        public readonly maxRetries: number,
        public readonly retriedAt: Date,
    ) { }
}