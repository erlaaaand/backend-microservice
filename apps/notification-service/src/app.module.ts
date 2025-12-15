import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Configs
import appConfig from './shared/configs/app.config';
import databaseConfig from './shared/configs/database.config';
import redisConfig from './shared/configs/redis.config';
import rabbitmqConfig from './shared/configs/rabbitmq.config';
import mailConfig from './shared/configs/mail.config';
import queueConfig from './shared/configs/queue.config';
import rateLimitConfig from './shared/configs/rate-limit.config';
import throttleConfig from './shared/configs/throttle.config';

// Modules
import { NotificationModule } from './modules/notification/notification.module';
import { HealthModule } from './modules/health/health.module';

// Middlewares
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { CorrelationIdMiddleware } from './shared/middlewares/correlation-id.middleware';
import { RequestContextMiddleware } from './shared/middlewares/request-context.middleware';

@Module({
    imports: [
        // 1. Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                appConfig,
                databaseConfig,
                redisConfig,
                rabbitmqConfig,
                mailConfig,
                queueConfig,
                rateLimitConfig,
                throttleConfig
            ],
        }),

        // 2. Event Emitter (PENTING: untuk @OnEvent decorator)
        EventEmitterModule.forRoot({
            // Set true untuk mengaktifkan wildcards jika diperlukan
            wildcard: false,
            // Pembatas listener memory leak
            maxListeners: 20,
        }),

        // 3. Database
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get('database'),
        }),

        // 4. Queue System (Bull/Redis)
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get('queue'),
        }),

        // 5. Mailer
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get('mail'),
        }),

        // 6. Feature Modules
        NotificationModule,
        HealthModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Terapkan middleware global
        consumer
            .apply(
                CorrelationIdMiddleware,
                RequestContextMiddleware,
                LoggerMiddleware
            )
            .forRoutes('*');
    }
}