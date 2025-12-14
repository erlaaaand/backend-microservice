// apps/auth-service/src/modules/auth/infrastructure/strategies/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../../../../shared/infrastructure/security/token.service';

/**
 * JWT Strategy untuk validasi token
 * Digunakan oleh JwtAuthGuard
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            // Extract JWT dari Authorization header (Bearer token)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            // Jangan ignore expiration
            ignoreExpiration: false,

            // Secret key untuk verify token
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
        });
    }

    /**
     * Validate method dipanggil setelah token berhasil di-verify
     * Payload adalah data yang ada di dalam token
     * Return value akan disimpan di request.user
     */
    async validate(payload: TokenPayload) {
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}