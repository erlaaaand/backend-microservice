// apps/auth-service/src/shared/types/pagination.types.ts

/**
 * Pagination types
 */
export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Paginated<T> {
    data: T[];
    meta: PaginationMeta;
}