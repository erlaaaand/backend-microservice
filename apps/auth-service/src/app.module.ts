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

@Module({
    imports: [
        // 1. Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // 2. Shared Infrastructure
        LoggerModule,
        DatabaseModule,
        RedisModule,
        MessagingModule,

        // 3. Feature Modules
        AuthModule,
        PresenceModule,
        HealthModule,
    ],
    providers: [
        // Global Exception Filter
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },

        // Global Interceptors
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: UserActivityInterceptor,
        },

        // Global Guard (JWT Authentication)
        {
            provide: APP_GUARD,
            useFactory: (reflector: Reflector) => {
                const guard = new JwtAuthGuard();
                (guard as any).reflector = reflector;
                return guard;
            },
            inject: [Reflector],
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CorrelationIdMiddleware, RequestContextMiddleware)
            .forRoutes('*');
    }
}