// Retry Configuration
export const RETRY_CONFIG = {
    MAX_ATTEMPTS: 5,
    INITIAL_DELAY: 1000, // 1 second
    MAX_DELAY: 60000, // 1 minute
    BACKOFF_MULTIPLIER: 2,
} as const;

// Retry Strategies
export const RETRY_STRATEGIES = {
    EXPONENTIAL: 'exponential',
    LINEAR: 'linear',
    FIXED: 'fixed',
} as const;

// Retry Reasons
export const RETRY_REASONS = {
    SMTP_ERROR: 'smtp_error',
    NETWORK_ERROR: 'network_error',
    RATE_LIMIT: 'rate_limit_exceeded',
    TIMEOUT: 'timeout',
    INVALID_RECIPIENT: 'invalid_recipient',
    TEMPORARY_FAILURE: 'temporary_failure',
    UNKNOWN: 'unknown_error',
} as const;

// Retryable Errors
export const RETRYABLE_ERRORS = [
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ENETUNREACH',
    'SMTP_TIMEOUT',
    'RATE_LIMIT',
];