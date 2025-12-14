// apps/auth-service/src/modules/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

// Entities
import { CredentialOrmEntity } from './infrastructure/entities/credential.orm-entity';

// Repositories
import { TypeOrmAuthRepository } from './infrastructure/repositories/typeorm-auth.repository';
import { AUTH_REPOSITORY } from './domain/ports/auth.repository.port';

// Mappers
import { CredentialMapper } from './infrastructure/mappers/credential.mapper';

// Strategies
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

// Use Cases
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ValidateTokenUseCase } from './application/use-cases/validate-token.use-case';

// Event Handlers
import { PublishUserCreatedHandler } from './application/event-handlers/publish-user-created.handler';
import { NotifyUserServiceHandler } from './application/event-handlers/notify-user-service.handler';

// Controllers
import { AuthController } from './presentation/auth.controller';

// Shared Services
import { TokenService } from '../../shared/infrastructure/security/token.service';
import { DomainEventDispatcher } from '../../shared/domain/events/domain-event-dispatcher';
import { getJwtConfig } from '../../shared/infrastructure/config/jwt.config';

/**
 * Auth Module
 * 
 * Fitur:
 * - User Registration & Login
 * - JWT Token Generation & Validation
 * - Password Hashing & Verification
 * - Domain Event Publishing
 * - Role-based Access Control
 */
@Module({
    imports: [
        // TypeORM Entities - Register entities yang digunakan di module ini
        TypeOrmModule.forFeature([CredentialOrmEntity]),

        // JWT Module - Konfigurasi JWT untuk token generation
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: getJwtConfig,
        }),

        // Passport - Authentication middleware
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        // Mappers - Convert antara Domain Entity dan ORM Entity
        CredentialMapper,

        // Repositories - Data access layer
        {
            provide: AUTH_REPOSITORY,
            useClass: TypeOrmAuthRepository,
        },

        // Strategies - Passport authentication strategies
        JwtStrategy,

        // Services - Shared services
        TokenService,
        DomainEventDispatcher,

        // Use Cases - Business logic
        RegisterUseCase,
        LoginUseCase,
        ValidateTokenUseCase,

        // Event Handlers - Handle domain events
        PublishUserCreatedHandler,
        NotifyUserServiceHandler,
    ],
    exports: [
        // Export agar bisa digunakan module lain
        AUTH_REPOSITORY,
        TokenService,
        JwtModule,
    ],
})
export class AuthModule {
    constructor(private readonly eventDispatcher: DomainEventDispatcher) {
        // Register event handlers saat module di-initialize
        // Handler akan dipanggil ketika event di-dispatch
        this.eventDispatcher.register(
            'user.registered',
            PublishUserCreatedHandler
        );

        this.eventDispatcher.register(
            'user.registered',
            NotifyUserServiceHandler
        );
    }
}