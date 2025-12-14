// apps/auth-service/src/modules/auth/application/dtos/request/login.request.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO untuk Login Request
 */
export class LoginRequestDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address'
    })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'User password'
    })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}