// apps/auth-service/src/modules/auth/application/use-cases/validate-token.use-case.ts

import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.base';
import { TokenResponseDto } from '../dtos/response/token.response.dto';
import { TokenService } from '../../../../shared/infrastructure/security/token.service';
import { UnauthorizedException } from '../../../../shared/exceptions/unauthorized.exception';
import { LoggerService } from '../../../../shared/infrastructure/logging/logger.service';

/**
 * Use Case: Validate JWT Token
 * Used by other microservices to validate tokens
 */
@Injectable()
export class ValidateTokenUseCase implements UseCase<string, TokenResponseDto> {
    constructor(
        private readonly tokenService: TokenService,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('ValidateTokenUseCase');
    }

    async execute(token: string): Promise<TokenResponseDto> {
        try {
            // Verify token
            const payload = this.tokenService.verifyAccessToken(token);

            this.logger.debug('Token validated successfully', { userId: payload.sub });

            return {
                valid: true,
                user: {
                    id: payload.sub,
                    email: payload.email,
                    role: payload.role,
                },
            };
        } catch (error) {
            this.logger.warn('Invalid token', { error: error.message });
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}