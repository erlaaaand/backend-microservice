// phone-number.validator.ts
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidPhoneNumberConstraint implements ValidatorConstraintInterface {
    validate(phoneNumber: string): boolean {
        if (!phoneNumber) return true; // Optional field

        // E.164 format: +[country code][number]
        const e164Regex = /^\+[1-9]\d{1,14}$/;

        return e164Regex.test(phoneNumber);
    }

    defaultMessage(): string {
        return 'Phone number must be in E.164 format (e.g., +628123456789)';
    }
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidPhoneNumberConstraint,
        });
    };
}
