// apps/auth-service/src/shared/infrastructure/security/token.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export interface TokenPayload {
    sub: string; // User ID
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

/**
 * Service untuk JWT Token management
 */
@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Generate Access Token
     */
    generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m') as JwtSignOptions['expiresIn'],
        });
    }

    /**
     * Generate Refresh Token
     */
    generateRefreshToken(payload: Pick<TokenPayload, 'sub'>): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d') as JwtSignOptions['expiresIn'],
        });
    }

    /**
     * Verify Access Token
     */
    verifyAccessToken(token: string): TokenPayload {
        return this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        });
    }

    /**
     * Verify Refresh Token
     */
    verifyRefreshToken(token: string): Pick<TokenPayload, 'sub'> {
        return this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });
    }

    /**
     * Decode token tanpa verify (untuk inspect)
     */
    decode(token: string): TokenPayload | null {
        return this.jwtService.decode(token) as TokenPayload;
    }
}