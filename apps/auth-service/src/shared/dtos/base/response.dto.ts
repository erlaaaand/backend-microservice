// apps/auth-service/src/shared/dtos/base/response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard response wrapper
 */
export class ResponseDto<T> {
    @ApiProperty()
    data: T;

    @ApiProperty()
    meta: {
        timestamp: string;
    };

    constructor(data: T) {
        this.data = data;
        this.meta = {
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Paginated response wrapper
 */
export class PaginatedResponseDto<T> {
    @ApiProperty()
    data: T[];

    @ApiProperty()
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        timestamp: string;
    };

    constructor(
        data: T[],
        total: number,
        page: number,
        limit: number,
    ) {
        this.data = data;
        this.meta = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            timestamp: new Date().toISOString(),
        };
    }
}