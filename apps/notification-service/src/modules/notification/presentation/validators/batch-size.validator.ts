// batch-size.validator.ts
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsBatchSizeValidConstraint implements ValidatorConstraintInterface {
    validate(value: any[], args: ValidationArguments): boolean {
        const [min, max] = args.constraints;
        return value && value.length >= min && value.length <= max;
    }

    defaultMessage(args: ValidationArguments): string {
        const [min, max] = args.constraints;
        return `Batch size must be between ${min} and ${max} items`;
    }
}

export function IsBatchSizeValid(
    min: number = 1,
    max: number = 100,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [min, max],
            validator: IsBatchSizeValidConstraint,
        });
    };
}