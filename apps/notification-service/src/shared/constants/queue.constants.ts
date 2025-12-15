// Queue Names
export const QUEUE_NAMES = {
    NOTIFICATION: 'notification',
    BATCH_NOTIFICATION: 'batch-notification',
    RETRY: 'notification-retry',
    DEAD_LETTER: 'notification-dlq',
} as const;

// Job Types
export const JOB_TYPES = {
    SEND_EMAIL: 'send-email',
    SEND_BATCH: 'send-batch',
    SEND_REMINDER: 'send-reminder',
    RETRY_NOTIFICATION: 'retry-notification',
    PROCESS_DLQ: 'process-dlq',
} as const;

// Queue Priorities
export const QUEUE_PRIORITIES = {
    CRITICAL: 1,
    HIGH: 2,
    NORMAL: 3,
    LOW: 4,
} as const;

// Job Options
export const JOB_OPTIONS = {
    DEFAULT: {
        attempts: 3,
        backoff: {
            type: 'exponential' as const,
            delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
    CRITICAL: {
        attempts: 5,
        backoff: {
            type: 'exponential' as const,
            delay: 1000,
        },
        priority: QUEUE_PRIORITIES.CRITICAL,
        removeOnComplete: true,
        removeOnFail: false,
    },
    BATCH: {
        attempts: 2,
        backoff: {
            type: 'fixed' as const,
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
} as const;