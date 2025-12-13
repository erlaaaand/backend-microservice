// apps/auth-service/src/shared/domain/value-objects/email.vo.ts

import { ValueObject, Primitives } from '../../core/value-object.base';
import { ArgumentInvalidException } from '../../exceptions/argument-invalid.exception';

type EmailProps = {
    value: string;
} & Record<string, Primitives>;

/**
 * Email Value Object
 * Memastikan email selalu dalam format yang valid
 */
export class Email extends ValueObject<EmailProps> {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private static readonly MAX_LENGTH = 255;

    get value(): string {
        return this.props.value;
    }

    protected validate(props: EmailProps): void {
        if (!props.value) {
            throw new ArgumentInvalidException('Email cannot be empty');
        }

        if (props.value.length > Email.MAX_LENGTH) {
            throw new ArgumentInvalidException(
                `Email must not exceed ${Email.MAX_LENGTH} characters`
            );
        }

        if (!Email.EMAIL_REGEX.test(props.value)) {
            throw new ArgumentInvalidException('Invalid email format');
        }
    }

    /**
     * Factory method untuk create Email VO
     */
    public static create(email: string): Email {
        return new Email({ value: email.toLowerCase().trim() });
    }

    /**
     * Helper untuk membandingkan email (case-insensitive)
     */
    public equalsTo(email: string): boolean {
        return this.value === email.toLowerCase().trim();
    }

    /**
     * Dapatkan domain dari email
     */
    public getDomain(): string {
        return this.value.split('@')[1];
    }

    /**
     * Dapatkan local part dari email (sebelum @)
     */
    public getLocalPart(): string {
        return this.value.split('@')[0];
    }

    /**
     * Override toString untuk kemudahan logging
     */
    public toString(): string {
        return this.value;
    }
}