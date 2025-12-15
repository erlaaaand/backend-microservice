// Cache Key Prefixes
export const CACHE_PREFIXES = {
    NOTIFICATION: 'notification',
    RATE_LIMIT: 'rate-limit',
    THROTTLE: 'throttle',
    TEMPLATE: 'template',
    USER: 'user',
} as const;

// Cache TTL (in seconds)
export const CACHE_TTL = {
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400, // 24 hours
} as const;

// Cache Keys
export const CACHE_KEYS = {
    NOTIFICATION_STATUS: (id: string) => `${CACHE_PREFIXES.NOTIFICATION}:status:${id}`,
    NOTIFICATION_HISTORY: (userId: string, page: number) =>
        `${CACHE_PREFIXES.NOTIFICATION}:history:${userId}:${page}`,
    RATE_LIMIT_EMAIL: (email: string) => `${CACHE_PREFIXES.RATE_LIMIT}:email:${email}`,
    RATE_LIMIT_IP: (ip: string) => `${CACHE_PREFIXES.RATE_LIMIT}:ip:${ip}`,
    THROTTLE_REQUEST: (key: string) => `${CACHE_PREFIXES.THROTTLE}:${key}`,
} as const;