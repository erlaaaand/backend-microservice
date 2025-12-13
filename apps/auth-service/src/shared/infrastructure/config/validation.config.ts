// apps/auth-service/src/shared/infrastructure/config/validation.config.ts

import { ValidationPipeOptions } from '@nestjs/common';

/**
 * Global validation pipe configuration
 */
export const getValidationConfig = (): ValidationPipeOptions => ({
    whitelist: true,           // Strip non-whitelisted properties
    forbidNonWhitelisted: true, // Throw error if non-whitelisted property exists
    transform: true,            // Auto-transform payloads to DTO instances
    transformOptions: {
        enableImplicitConversion: true, // Convert types automatically
    },
    stopAtFirstError: false,   // Return all validation errors
});