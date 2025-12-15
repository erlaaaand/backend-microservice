import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: parseInt(process.env.PORT, 10) || 3002,
    nodeEnv: process.env.NODE_ENV || 'development',
    serviceName: process.env.SERVICE_NAME || 'notification-service',

    // API Configuration
    apiPrefix: process.env.API_PREFIX || 'api/v1',
    apiKey: process.env.API_KEY || 'default-api-key-change-in-production',

    // CORS
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],

    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',

    // Timeouts
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT, 10) || 30000,

    // Pagination
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE, 10) || 20,
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE, 10) || 100,
}));