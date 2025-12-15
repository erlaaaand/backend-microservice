// pagination.util.ts
export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export function paginate<T>(
    data: T[],
    total: number,
    options: PaginationOptions,
): PaginatedResult<T> {
    const totalPages = Math.ceil(total / options.limit);

    return {
        data,
        total,
        page: options.page,
        limit: options.limit,
        totalPages,
        hasNext: options.page < totalPages,
        hasPrev: options.page > 1,
    };
}
