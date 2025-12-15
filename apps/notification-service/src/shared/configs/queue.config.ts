import { registerAs } from '@nestjs/config';
import { BullModuleOptions } from '@nestjs/bull';

export default registerAs(
    'queue',
    (): BullModuleOptions => ({
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT, 10) || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            db: parseInt(process.env.REDIS_QUEUE_DB, 10) || 1,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        },

        // Default Job Options
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        },

        settings: {
            lockDuration: 30000,
            stalledInterval: 30000,
            maxStalledCount: 3,
        },
    }),
);