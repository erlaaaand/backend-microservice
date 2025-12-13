// apps/auth-service/src/shared/dtos/validators/is-valid-phone.validator.ts

import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Custom validator untuk phone number
 * Format: +62xxxxxxxxxx (Indonesia)
 */
@ValidatorConstraint({ name: 'isValidPhone', async: false })
export class IsValidPhoneConstraint implements ValidatorConstraintInterface {
    validate(phone: string): boolean {
        if (!phone) {
            return false;
        }

        // Format: +62 followed by 9-12 digits
        const phoneRegex = /^\+62[0-9]{9,12}$/;
        return phoneRegex.test(phone);
    }

    defaultMessage(): string {
        return 'Phone number must be in format +62xxxxxxxxxx';
    }
}

export function IsValidPhone(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidPhoneConstraint,
        });
    };
}