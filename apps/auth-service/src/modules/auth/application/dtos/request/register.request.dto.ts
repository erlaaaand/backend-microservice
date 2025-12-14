// apps/auth-service/src/modules/auth/application/dtos/request/register.request.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';
import { IsStrongPassword } from '../../../../../shared/dtos/validators/is-strong-password.validator';
import { Match } from '../../../../../shared/dtos/validators/match.validator';
import { IsValidPhone } from '../../../../../shared/dtos/validators/is-valid-phone.validator';

/**
 * DTO untuk Register Request
 */
export class RegisterRequestDto {
    @ApiPropertyOptional({
        example: 'user@example.com',
        description: 'User email address (required if phoneNumber is not provided)',
    })
    @ValidateIf(o => !o.phoneNumber)
    @IsNotEmpty({ message: 'Email is required if phone number is not provided' })
    @IsEmail({}, { message: 'Invalid email format' })
    email?: string;

    @ApiPropertyOptional({
        example: '6281234567890',
        description: 'User phone number (required if email is not provided)',
    })
    @ValidateIf(o => !o.email)
    @IsNotEmpty({ message: 'Phone number is required if email is not provided' })
    @IsValidPhone()
    phoneNumber?: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'User password (min 8 characters, must contain uppercase, lowercase, number, and special character)'
    })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @IsStrongPassword()
    password: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'Password confirmation'
    })
    @IsString()
    @IsNotEmpty({ message: 'Password confirmation is required' })
    @Match('password', { message: 'Passwords do not match' })
    passwordConfirmation: string;
}