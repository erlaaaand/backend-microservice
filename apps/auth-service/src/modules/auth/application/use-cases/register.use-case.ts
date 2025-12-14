import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.base';
import { RegisterRequestDto } from '../dtos/request/register.request.dto';
import { LoginResponseDto } from '../dtos/response/login.response.dto';
import { AUTH_REPOSITORY, AuthRepositoryPort } from '../../domain/ports/auth.repository.port';
import { Email } from '../../../../shared/domain/value-objects/email.vo';
import { Password } from '../../../../shared/domain/value-objects/password.vo';
import { Credential, UserRole } from '../../domain/credential.entity';
import { ConflictException } from '../../../../shared/exceptions/conflict.exception';
import { TokenService } from '../../../../shared/infrastructure/security/token.service';
import { DomainEventDispatcher } from '../../../../shared/domain/events/domain-event-dispatcher';
import { LoggerService } from '../../../../shared/infrastructure/logging/logger.service';
import { PhoneNumber } from '../../../../shared/domain/value-objects/phone-number.vo'; // Pastikan path benar

@Injectable()
export class RegisterUseCase implements UseCase<RegisterRequestDto, LoginResponseDto> {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: AuthRepositoryPort,
        private readonly tokenService: TokenService,
        private readonly eventDispatcher: DomainEventDispatcher,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('RegisterUseCase');
    }

    async execute(dto: RegisterRequestDto): Promise<LoginResponseDto> {
        this.logger.log('Starting user registration');

        // 1. Validasi: Cek Duplikasi (Fail Fast)
        if (dto.email) {
            const emailExists = await this.authRepository.findByEmail(dto.email);
            if (emailExists) {
                throw new ConflictException('Email already registered');
            }
        }

        if (dto.phoneNumber) {
            const phoneExists = await this.authRepository.findByPhone(dto.phoneNumber);
            if (phoneExists) {
                throw new ConflictException('Phone number already registered');
            }
        }

        // 2. Create Value Objects
        // Email & Phone bersifat optional (salah satu harus ada, divalidasi di DTO/Entity)
        const emailVO = dto.email ? Email.create(dto.email) : undefined;
        const phoneVO = dto.phoneNumber ? PhoneNumber.create(dto.phoneNumber) : undefined;
        const passwordVO = Password.create(dto.password);

        // 3. Hash Password
        const hashedPassword = await passwordVO.hash();

        // 4. Create Entity
        // NOTE: Pastikan urutan parameter di method create() Entity Anda sesuai!
        // Saran urutan: (password, email, phone, role)
        const credential = Credential.create(
            hashedPassword,
            emailVO,
            phoneVO,
            UserRole.USER
        );

        // 5. Save to Database
        const savedCredential = await this.authRepository.save(credential);

        // 6. Dispatch Domain Events
        // Menggunakan try-finally untuk memastikan events dibersihkan meski dispatch gagal (opsional, tergantung strategi error handling)
        try {
            await this.eventDispatcher.dispatchAll(savedCredential.domainEvents);
        } catch (error) {
            this.logger.error('Failed to dispatch domain events', error.stack);
            // Jangan throw error di sini agar user tetap terdaftar (eventual consistency)
        } finally {
            savedCredential.clearDomainEvents();
        }

        // 7. Generate Token Payload
        // Masukkan data identitas yang tersedia ke dalam token
        const tokenPayload = {
            sub: savedCredential.id,
            role: savedCredential.role,
            email: savedCredential.email?.value ?? null,
            phoneNumber: savedCredential.phoneNumber?.value ?? null, // Tambahan penting
        };

        const accessToken = this.tokenService.generateAccessToken(tokenPayload);
        const refreshToken = this.tokenService.generateRefreshToken({ sub: savedCredential.id });

        this.logger.log('User registered successfully', { userId: savedCredential.id });

        // 8. Return Response
        return {
            accessToken,
            refreshToken,
            expiresIn: 900, // Hardcode 15 menit atau ambil dari ConfigService jika memungkinkan
            tokenType: 'Bearer',
            user: {
                id: savedCredential.id,
                email: savedCredential.email?.value ?? null,
                phoneNumber: savedCredential.phoneNumber?.value ?? null, // Return phone number
                role: savedCredential.role,
            },
        };
    }
}