import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.base';
import { LoginRequestDto } from '../dtos/request/login.request.dto';
import { LoginResponseDto } from '../dtos/response/login.response.dto';
import { AUTH_REPOSITORY, AuthRepositoryPort } from '../../domain/ports/auth.repository.port';
import { UnauthorizedException } from '../../../../shared/exceptions/unauthorized.exception';
import { TokenService } from '../../../../shared/infrastructure/security/token.service';
import { LoggerService } from '../../../../shared/infrastructure/logging/logger.service';

/**
 * Use Case: Login user
 */
@Injectable()
export class LoginUseCase implements UseCase<LoginRequestDto, LoginResponseDto> {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: AuthRepositoryPort,
        private readonly tokenService: TokenService,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('LoginUseCase');
    }

    async execute(dto: LoginRequestDto): Promise<LoginResponseDto> {
        this.logger.log('User login attempt', { email: dto.email });

        // 1. Find user by email
        const credential = await this.authRepository.findByEmail(dto.email);
        if (!credential) {
            this.logger.warn('Login failed: user not found', { email: dto.email });
            throw new UnauthorizedException('Invalid email or password');
        }

        // 2. Verify password
        const isPasswordValid = await credential.verifyPassword(dto.password);
        if (!isPasswordValid) {
            this.logger.warn('Login failed: invalid password', { email: dto.email });
            throw new UnauthorizedException('Invalid email or password');
        }

        // 3. Update last login
        credential.updateLastLogin();
        await this.authRepository.save(credential);

        // 4. Generate tokens
        // [PERBAIKAN 1] Tambahkan phoneNumber ke payload token
        const accessToken = this.tokenService.generateAccessToken({
            sub: credential.id,
            email: credential.email?.value ?? null, // Handle optional email
            phoneNumber: credential.phoneNumber?.value ?? null, // Handle optional phone
            role: credential.role,
        });

        const refreshToken = this.tokenService.generateRefreshToken({
            sub: credential.id,
        });

        this.logger.log('User logged in successfully', { userId: credential.id });

        // 5. Return response
        // [PERBAIKAN 2] Tambahkan phoneNumber ke response object
        return {
            accessToken,
            refreshToken,
            expiresIn: 900, // 15 minutes
            tokenType: 'Bearer',
            user: {
                id: credential.id,
                email: credential.email?.value ?? null,
                phoneNumber: credential.phoneNumber?.value ?? null, // Tambahkan ini
                role: credential.role,
            },
        };
    }
}