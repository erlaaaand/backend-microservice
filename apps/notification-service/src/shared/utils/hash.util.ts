// hash.util.ts
import * as crypto from 'crypto';

export class HashUtil {
    /**
     * Generate MD5 hash
     */
    static md5(text: string): string {
        return crypto.createHash('md5').update(text).digest('hex');
    }

    /**
     * Generate SHA256 hash
     */
    static sha256(text: string): string {
        return crypto.createHash('sha256').update(text).digest('hex');
    }

    /**
     * Generate SHA512 hash
     */
    static sha512(text: string): string {
        return crypto.createHash('sha512').update(text).digest('hex');
    }

    /**
     * Generate HMAC
     */
    static hmac(algorithm: string, key: string, text: string): string {
        return crypto.createHmac(algorithm, key).update(text).digest('hex');
    }

    /**
     * Generate random hash
     */
    static random(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Generate UUID v4
     */
    static uuid(): string {
        return crypto.randomUUID();
    }

    /**
     * Generate short ID (like nanoid)
     */
    static shortId(length: number = 12): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }

        return result;
    }

    /**
     * Verify hash
     */
    static verify(algorithm: string, text: string, hash: string): boolean {
        const computed = crypto.createHash(algorithm).update(text).digest('hex');
        return computed === hash;
    }
}
