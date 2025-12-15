// email.validator.ts (Custom Validator)
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidEmailConstraint implements ValidatorConstraintInterface {
    validate(email: string): boolean {
        // More strict email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!emailRegex.test(email)) {
            return false;
        }

        // Check for common disposable email domains
        const disposableDomains = [
            'tempmail.com',
            '10minutemail.com',
            'guerrillamail.com',
            'mailinator.com',
        ];

        const domain = email.split('@')[1]?.toLowerCase();
        if (disposableDomains.includes(domain)) {
            return false;
        }

        return true;
    }

    defaultMessage(): string {
        return 'Email address is invalid or from a disposable email provider';
    }
}

export function IsValidEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidEmailConstraint,
        });
    };
}