// apps/auth-service/src/modules/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

// Entities
import { CredentialOrmEntity } from './infrastructure/entities/credential.orm-entity.ts';

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

// Controllers
import { AuthController } from './presentation/auth.controller';

// Shared Services
import { TokenService } from '../../shared/infrastructure/security/token.service';
import { DomainEventDispatcher } from '../../shared/domain/events/domain-event-dispatcher';
import { getJwtConfig } from '../../shared/infrastructure/config/jwt.config';

@Module({
    imports: [
        // TypeORM Entities
        TypeOrmModule.forFeature([CredentialOrmEntity]),

        // JWT Module
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: getJwtConfig,
        }),

        // Passport
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [
        // Mappers
        CredentialMapper,

        // Repositories
        {
            provide: AUTH_REPOSITORY,
            useClass: TypeOrmAuthRepository,
        },

        // Strategies
        JwtStrategy,

        // Services
        TokenService,
        DomainEventDispatcher,

        // Use Cases
        RegisterUseCase,
        LoginUseCase,
        ValidateTokenUseCase,

        // Event Handlers
        PublishUserCreatedHandler,
    ],
    exports: [
        AUTH_REPOSITORY,
        TokenService,
    ],
})
export class AuthModule {
    constructor(private readonly eventDispatcher: DomainEventDispatcher) {
        // Register event handlers
        this.eventDispatcher.register(
            'user.registered',
            PublishUserCreatedHandler
        );
    }
}