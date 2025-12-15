// patterns/event-patterns.ts
export const EVENT_PATTERNS = {
    // Incoming events (from other services)
    USER_CREATED: 'user.created',
    USER_VERIFIED: 'user.verified',
    USER_EMAIL_VERIFICATION_REQUESTED: 'user.email.verification.requested',
    PASSWORD_RESET_REQUESTED: 'user.password.reset.requested',
    ORDER_CREATED: 'order.created',
    ORDER_COMPLETED: 'order.completed',
    ORDER_CANCELLED: 'order.cancelled',
    PAYMENT_SUCCESS: 'payment.success',
    PAYMENT_FAILED: 'payment.failed',

    // Outgoing events (from notification service)
    NOTIFICATION_SENT: 'notification.sent',
    NOTIFICATION_FAILED: 'notification.failed',
    NOTIFICATION_RETRIED: 'notification.retried',
    NOTIFICATION_CANCELLED: 'notification.cancelled',
} as const;