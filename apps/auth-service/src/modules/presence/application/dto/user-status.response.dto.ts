// apps/auth-service/src/modules/presence/application/dto/user-status.response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO untuk User Status Response
 */
export class UserStatusResponseDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    userId: string;

    @ApiProperty({ example: true })
    isOnline: boolean;

    @ApiProperty({ example: '2024-01-15T10:30:00.000Z', required: false })
    lastSeen?: string;
}

/**
 * DTO untuk Online Users Response
 */
export class OnlineUsersResponseDto {
    @ApiProperty({ type: [String], example: ['user-id-1', 'user-id-2'] })
    userIds: string[];

    @ApiProperty({ example: 2 })
    count: number;
}