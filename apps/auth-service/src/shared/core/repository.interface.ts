// apps/auth-service/src/shared/core/repository.interface.ts

import { Entity } from './entity.base';

/**
 * Pagination Options
 */
export interface PaginationOptions {
    page: number;
    limit: number;
}

/**
 * Pagination Result
 */
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Generic Repository Interface
 * Abstraksi untuk data persistence operations
 * 
 * @template TEntity - Domain Entity
 * @template TId - ID type (biasanya string)
 */
export interface Repository<TEntity extends Entity<any>, TId = string> {
    /**
     * Save entity (insert or update)
     */
    save(entity: TEntity): Promise<TEntity>;

    /**
     * Save multiple entities
     */
    saveMany(entities: TEntity[]): Promise<TEntity[]>;

    /**
     * Find entity by ID
     */
    findById(id: TId): Promise<TEntity | null>;

    /**
     * Find all entities
     */
    findAll(): Promise<TEntity[]>;

    /**
     * Find with pagination
     */
    findPaginated(options: PaginationOptions): Promise<PaginatedResult<TEntity>>;

    /**
     * Delete entity (soft delete jika supported)
     */
    delete(id: TId): Promise<void>;

    /**
     * Hard delete (permanent)
     */
    hardDelete?(id: TId): Promise<void>;

    /**
     * Check if entity exists
     */
    exists(id: TId): Promise<boolean>;

    /**
     * Count total entities
     */
    count(): Promise<number>;

    /**
     * Begin transaction
     */
    transaction<T>(work: () => Promise<T>): Promise<T>;
}