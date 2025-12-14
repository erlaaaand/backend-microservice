// apps/auth-service/src/app.module.ts

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';

// Shared Modules
import { DatabaseModule } from './shared/infrastructure/persistence/database.module';
import { RedisModule } from './shared/infrastructure/caching/redis.module';
import { MessagingModule } from './shared/infrastructure/messaging/messaging.module';
import { LoggerModule } from './shared/infrastructure/logging/logger.module';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { PresenceModule } from './modules/presence/presence.module';
import { HealthModule } from './modules/health/health.module';

// Global Filters, Interceptors, Guards
import { GlobalExceptionFilter } from './shared/api/filters/global-exception.filter';
import { ResponseInterceptor } from './shared/api/interceptors/response.interceptor';
import { LoggingInterceptor } from './shared/api/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './shared/api/interceptors/timeout.interceptor';
import { UserActivityInterceptor } from './shared/api/interceptors/user-activity.interceptor';
import { JwtAuthGuard } from './shared/api/guards/jwt-auth.guard';

// Middlewares
import { CorrelationIdMiddleware } from './shared/api/middlewares/correlation-id.middleware';
import { RequestContextMiddleware } from './shared/api/middlewares/request-context.middleware';

// Reflector for Guards
import { Reflector } from '@nestjs/core';

/**
 * App Module - Root Module
 * 
 * Struktur:
 * 1. Configuration - Environment variables, global config
 * 2. Shared Infrastructure - Database, Cache, Messaging, Logging
 * 3. Feature Modules - Auth, Presence, Health
 * 4. Global Providers - Filters, Interceptors, Guards
 * 5. Middlewares - Request preprocessing
 */
@Module({
    imports: [
        // ============================================
        // 1. CONFIGURATION
        // ============================================
        ConfigModule.forRoot({
            isGlobal: true,           // Available di semua module
            envFilePath: '.env',      // Path ke .env file
            cache: true,              // Cache environment variables
        }),

        // ============================================
        // 2. SHARED INFRASTRUCTURE MODULES
        // ============================================
        // Logger - Centralized logging with context
        LoggerModule,

        // Database - MySQL dengan TypeORM
        DatabaseModule,

        // Redis - Caching & Session management
        RedisModule,

        // Messaging - RabbitMQ untuk event-driven architecture
        MessagingModule,

        // ============================================
        // 3. FEATURE MODULES
        // ============================================
        // Auth - Authentication & Authorization
        AuthModule,

        // Presence - User online/offline tracking
        PresenceModule,

        // Health - Health check & monitoring
        HealthModule,
    ],
    providers: [
        // ============================================
        // 4. GLOBAL PROVIDERS
        // ============================================

        // Global Exception Filter
        // Menangkap semua exception dan mengubahnya ke format standard
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },

        // Global Interceptors (dieksekusi berurutan)

        // 1. Response Interceptor
        // Membungkus semua response sukses dengan format standard
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },

        // 2. Logging Interceptor
        // Log setiap request & response untuk debugging & monitoring
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },

        // 3. Timeout Interceptor
        // Set timeout untuk semua request (default: 30 detik)
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor,
        },

        // 4. User Activity Interceptor
        // Update user online status di Redis setiap request
        {
            provide: APP_INTERCEPTOR,
            useClass: UserActivityInterceptor,
        },

        // Global Guard (JWT Authentication)
        // Melindungi semua endpoint kecuali yang di-mark dengan @Public()
        {
            provide: APP_GUARD,
            useFactory: (reflector: Reflector) => {
                const guard = new JwtAuthGuard(reflector);
                return guard;
            },
            inject: [Reflector],
        },
    ],
})
export class AppModule implements NestModule {
    /**
     * Configure Middlewares
     * Middleware dieksekusi sebelum route handler
     */
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                // 1. Correlation ID Middleware
                // Menambahkan unique ID ke setiap request untuk tracking
                CorrelationIdMiddleware,

                // 2. Request Context Middleware
                // Setup request context untuk logging & tracking
                RequestContextMiddleware,
            )
            .forRoutes('*'); // Apply ke semua routes
    }
}