import * as bcrypt from 'bcrypt';

export class EncryptionUtil {
    private static readonly SALT_ROUNDS = 10;

    /**
     * Mengubah password mentah menjadi hash
     */
    static async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    /**
     * Membandingkan password mentah dengan hash yang tersimpan
     */
    static async compare(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }
}