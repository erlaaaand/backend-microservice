// apps/auth-service/src/modules/auth/application/dtos/response/token.response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO untuk Token Validation Response
 */
export class TokenResponseDto {
    @ApiProperty({
        example: true,
        description: 'Whether the token is valid'
    })
    valid: boolean;

    @ApiProperty({
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'user@example.com',
            role: 'USER'
        },
        description: 'User information from token',
        required: false
    })
    user?: {
        id: string;
        email: string;
        role: string;
    };
}