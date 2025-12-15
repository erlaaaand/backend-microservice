// rate-limit.constants.ts (Enhanced)
export const RATE_LIMIT_CONSTANTS = {
    // Global limits
    GLOBAL_REQUESTS_PER_MINUTE: 100,
    GLOBAL_REQUESTS_PER_HOUR: 5000,

    // Per-user limits
    USER_REQUESTS_PER_MINUTE: 20,
    USER_REQUESTS_PER_HOUR: 1000,

    // Per-IP limits
    IP_REQUESTS_PER_MINUTE: 50,
    IP_REQUESTS_PER_HOUR: 2000,

    // Email sending limits
    EMAILS_PER_RECIPIENT_PER_HOUR: 10,
    EMAILS_PER_RECIPIENT_PER_DAY: 50,

    // Batch limits
    MAX_BATCH_SIZE: 100,
    BATCH_REQUESTS_PER_HOUR: 10,

    // SMS limits (for future)
    SMS_PER_NUMBER_PER_HOUR: 5,
    SMS_PER_NUMBER_PER_DAY: 20,
} as const;