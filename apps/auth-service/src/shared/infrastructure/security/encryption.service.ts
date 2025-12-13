// apps/auth-service/src/shared/infrastructure/security/encryption.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * Service untuk encryption (two-way encryption)
 * Digunakan untuk data yang perlu di-decrypt kembali
 */
@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-gcm';
    private readonly key: Buffer;

    constructor(private readonly configService: ConfigService) {
        // Pastikan ENCRYPTION_KEY ada di .env (32 bytes hex string)
        const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
        if (!encryptionKey) {
            throw new Error('ENCRYPTION_KEY must be defined in environment');
        }
        this.key = Buffer.from(encryptionKey, 'hex');
    }

    /**
     * Encrypt data
     */
    encrypt(plainText: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

        let encrypted = cipher.update(plainText, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        // Return: iv:authTag:encryptedData
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    }

    /**
     * Decrypt data
     */
    decrypt(encryptedText: string): string {
        const parts = encryptedText.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted text format');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encrypted = parts[2];

        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    /**
     * Generate encryption key (untuk initial setup)
     */
    static generateKey(): string {
        return crypto.randomBytes(32).toString('hex');
    }
}