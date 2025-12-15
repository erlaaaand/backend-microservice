// patterns/routing-keys.ts
export const ROUTING_KEYS = {
    // User events
    USER: {
        CREATED: 'user.created',
        VERIFIED: 'user.verified',
        EMAIL_VERIFICATION: 'user.email.verification',
        PASSWORD_RESET: 'user.password.reset',
    },

    // Order events
    ORDER: {
        CREATED: 'order.created',
        COMPLETED: 'order.completed',
        CANCELLED: 'order.cancelled',
    },

    // Payment events
    PAYMENT: {
        SUCCESS: 'payment.success',
        FAILED: 'payment.failed',
    },

    // Notification events
    NOTIFICATION: {
        SENT: 'notification.sent',
        FAILED: 'notification.failed',
        RETRIED: 'notification.retried',
        CANCELLED: 'notification.cancelled',
    },
} as const;