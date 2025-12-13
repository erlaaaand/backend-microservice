// apps/auth-service/src/shared/infrastructure/security/hashing.service.ts

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * Service untuk hashing (one-way encryption)
 * Digunakan untuk password, sensitive data yang tidak perlu di-decrypt
 */
@Injectable()
export class HashingService {
    private readonly SALT_ROUNDS = 10;

    /**
     * Hash string menggunakan bcrypt
     */
    async hash(plainText: string): Promise<string> {
        return bcrypt.hash(plainText, this.SALT_ROUNDS);
    }

    /**
     * Verify plain text dengan hash
     */
    async verify(plainText: string, hashedText: string): Promise<boolean> {
        return bcrypt.compare(plainText, hashedText);
    }

    /**
     * Generate hash menggunakan SHA-256
     */
    sha256(data: string): string {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    /**
     * Generate random token
     */
    generateToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Generate OTP (One-Time Password)
     */
    generateOTP(length: number = 6): string {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    }
}