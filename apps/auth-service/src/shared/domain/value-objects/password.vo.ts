// apps/auth-service/src/shared/domain/value-objects/password.vo.ts

import { ValueObject } from '../../core/value-object.base';
import { ArgumentInvalidException } from '../../exceptions/argument-invalid.exception';
import * as bcrypt from 'bcrypt';

type PasswordProps = {
    value: string;
    hashed?: boolean;
}

/**
 * Password Value Object
 * Handle password validation dan hashing
 */
export class Password extends ValueObject<PasswordProps> {
    private static readonly MIN_LENGTH = 8;
    private static readonly MAX_LENGTH = 100;
    private static readonly SALT_ROUNDS = 10;

    get value(): string {
        return this.props.value;
    }

    get isHashed(): boolean {
        return this.props.hashed || false;
    }

    protected validate(props: PasswordProps): void {
        if (!props.value) {
            throw new ArgumentInvalidException('Password cannot be empty');
        }

        // Skip validasi jika password sudah di-hash
        if (props.hashed) {
            return;
        }

        if (props.value.length < Password.MIN_LENGTH) {
            throw new ArgumentInvalidException(
                `Password must be at least ${Password.MIN_LENGTH} characters`
            );
        }

        if (props.value.length > Password.MAX_LENGTH) {
            throw new ArgumentInvalidException(
                `Password must not exceed ${Password.MAX_LENGTH} characters`
            );
        }

        // Password harus mengandung: huruf besar, huruf kecil, angka, dan karakter spesial
        const hasUpperCase = /[A-Z]/.test(props.value);
        const hasLowerCase = /[a-z]/.test(props.value);
        const hasNumber = /[0-9]/.test(props.value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(props.value);

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            throw new ArgumentInvalidException(
                'Password must contain uppercase, lowercase, number, and special character'
            );
        }
    }

    /**
     * Create password dari plain text (belum di-hash)
     */
    public static create(plainPassword: string): Password {
        return new Password({ value: plainPassword, hashed: false });
    }

    /**
     * Create password dari hash yang sudah ada (dari database)
     */
    public static fromHash(hashedPassword: string): Password {
        return new Password({ value: hashedPassword, hashed: true });
    }

    /**
     * Hash password menggunakan bcrypt
     */
    public async hash(): Promise<Password> {
        if (this.isHashed) {
            return this;
        }

        const hashed = await bcrypt.hash(this.value, Password.SALT_ROUNDS);
        return new Password({ value: hashed, hashed: true });
    }

    /**
     * Compare plain password dengan hashed password
     */
    public async compare(plainPassword: string): Promise<boolean> {
        if (!this.isHashed) {
            throw new Error('Cannot compare unhashed password');
        }

        return bcrypt.compare(plainPassword, this.value);
    }

    /**
     * Override toString untuk security (jangan tampilkan password)
     */
    public toString(): string {
        return '[PROTECTED]';
    }

    /**
     * Override toJSON untuk security
     */
    public toJSON(): any {
        return '[PROTECTED]';
    }
}