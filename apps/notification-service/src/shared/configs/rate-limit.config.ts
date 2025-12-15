import { registerAs } from '@nestjs/config';

export default registerAs('rateLimit', () => ({
    // Global Rate Limits
    global: {
        ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60, // seconds
        limit: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    },

    // Per-Email Rate Limits
    perEmail: {
        ttl: 3600, // 1 hour
        limit: 10, // max 10 emails per hour per recipient
    },

    // Per-IP Rate Limits
    perIP: {
        ttl: 60,
        limit: 50,
    },

    // Batch Limits
    batch: {
        maxSize: parseInt(process.env.BATCH_MAX_SIZE, 10) || 100,
        rateLimitPerMinute: 500,
    },
}));