import { registerAs } from '@nestjs/config';

export default registerAs('throttle', () => ({
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60000, // milliseconds
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 50,

    // Storage
    storage: 'redis',

    // Skip Options
    skipSuccessfulRequests: false,
    skipFailedRequests: false,

    // Custom Key Generator
    keyGenerator: (req: any) => {
        return req.ip || req.connection.remoteAddress;
    },
}));