// apps/auth-service/src/shared/domain/value-objects/phone-number.vo.ts

import { Primitives, ValueObject } from '../../core/value-object.base';
import { ArgumentInvalidException } from '../../exceptions/argument-invalid.exception';

type PhoneNumberProps = {
    value: string;
} & Record<string, Primitives>;


/**
 * Phone Number Value Object (Indonesian format)
 */
export class PhoneNumber extends ValueObject<PhoneNumberProps> {
    private static readonly PHONE_REGEX = /^\+62[0-9]{9,12}$/;

    get value(): string {
        return this.props.value;
    }

    protected validate(props: PhoneNumberProps): void {
        if (!props.value) {
            throw new ArgumentInvalidException('Phone number cannot be empty');
        }

        if (!PhoneNumber.PHONE_REGEX.test(props.value)) {
            throw new ArgumentInvalidException(
                'Phone number must be in format +62xxxxxxxxxx'
            );
        }
    }

    public static create(phoneNumber: string): PhoneNumber {
        // Normalize: remove spaces and ensure +62 prefix
        let normalized = phoneNumber.replace(/\s/g, '');

        // Convert 08xx to +628xx
        if (normalized.startsWith('08')) {
            normalized = '+62' + normalized.substring(1);
        }
        // Convert 62xx to +62xx
        else if (normalized.startsWith('62')) {
            normalized = '+' + normalized;
        }
        // If already has +62, keep as is

        return new PhoneNumber({ value: normalized });
    }

    public toString(): string {
        return this.value;
    }

    /**
     * Format for display (with spaces)
     */
    public toDisplayFormat(): string {
        // +62 812 3456 7890
        const withoutPrefix = this.value.substring(3);
        const parts = withoutPrefix.match(/.{1,4}/g) || [];
        return '+62 ' + parts.join(' ');
    }
}