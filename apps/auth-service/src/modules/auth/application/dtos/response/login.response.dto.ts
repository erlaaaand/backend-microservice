// apps/auth-service/src/modules/auth/application/dtos/response/login.response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO untuk Login Response
 */
export class LoginResponseDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT Access Token'
    })
    accessToken: string;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT Refresh Token'
    })
    refreshToken: string;

    @ApiProperty({
        example: 900,
        description: 'Token expiration time in seconds'
    })
    expiresIn: number;

    @ApiProperty({
        example: 'Bearer',
        description: 'Token type'
    })
    tokenType: string;

    @ApiProperty({
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'user@example.com',
            role: 'USER'
        },
        description: 'User information'
    })
    user: {
        id: string;
        email: string | null;
        phoneNumber: string | null;
        role: string;
    };
}