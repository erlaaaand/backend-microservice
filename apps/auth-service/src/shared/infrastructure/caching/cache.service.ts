// apps/auth-service/src/shared/infrastructure/caching/cache.service.ts

import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.module';
import { LoggerService } from '../logging/logger.service';

export interface CacheOptions {
    ttl?: number; // Time to live in seconds
}

/**
 * Cache Service wrapper untuk Redis
 * Menyediakan API yang lebih friendly untuk caching
 */
@Injectable()
export class CacheService {
    constructor(
        @Inject(REDIS_CLIENT) private readonly redis: Redis,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext('CacheService');
    }

    /**
     * Get cached value
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.redis.get(key);
            if (!value) {
                return null;
            }
            return JSON.parse(value) as T;
        } catch (error) {
            this.logger.error(`Cache get error for key: ${key}`, error.stack);
            return null;
        }
    }

    /**
     * Set cache value
     */
    async set(key: string, value: any, options?: CacheOptions): Promise<void> {
        try {
            const serialized = JSON.stringify(value);

            if (options?.ttl) {
                await this.redis.set(key, serialized, 'EX', options.ttl);
            } else {
                await this.redis.set(key, serialized);
            }

            this.logger.debug(`Cache set: ${key}`, { ttl: options?.ttl });
        } catch (error) {
            this.logger.error(`Cache set error for key: ${key}`, error.stack);
        }
    }

    /**
     * Delete cache
     */
    async delete(key: string): Promise<void> {
        try {
            await this.redis.del(key);
            this.logger.debug(`Cache deleted: ${key}`);
        } catch (error) {
            this.logger.error(`Cache delete error for key: ${key}`, error.stack);
        }
    }

    /**
     * Delete multiple keys by pattern
     */
    async deleteByPattern(pattern: string): Promise<void> {
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
                this.logger.debug(`Cache deleted by pattern: ${pattern}`, { count: keys.length });
            }
        } catch (error) {
            this.logger.error(`Cache delete by pattern error: ${pattern}`, error.stack);
        }
    }

    /**
     * Check if key exists
     */
    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.redis.exists(key);
            return result === 1;
        } catch (error) {
            this.logger.error(`Cache exists check error for key: ${key}`, error.stack);
            return false;
        }
    }

    /**
     * Set TTL for existing key
     */
    async expire(key: string, seconds: number): Promise<void> {
        try {
            await this.redis.expire(key, seconds);
            this.logger.debug(`Cache TTL set: ${key}`, { seconds });
        } catch (error) {
            this.logger.error(`Cache expire error for key: ${key}`, error.stack);
        }
    }

    /**
     * Get or set pattern (cache-aside)
     * Jika cache miss, jalankan factory function dan cache hasilnya
     */
    async getOrSet<T>(
        key: string,
        factory: () => Promise<T>,
        options?: CacheOptions,
    ): Promise<T> {
        // Try to get from cache first
        const cached = await this.get<T>(key);
        if (cached !== null) {
            this.logger.debug(`Cache hit: ${key}`);
            return cached;
        }

        // Cache miss - get from source
        this.logger.debug(`Cache miss: ${key}`);
        const value = await factory();

        // Save to cache
        await this.set(key, value, options);

        return value;
    }

    /**
     * Increment counter
     */
    async increment(key: string, amount: number = 1): Promise<number> {
        try {
            return await this.redis.incrby(key, amount);
        } catch (error) {
            this.logger.error(`Cache increment error for key: ${key}`, error.stack);
            throw error;
        }
    }

    /**
     * Decrement counter
     */
    async decrement(key: string, amount: number = 1): Promise<number> {
        try {
            return await this.redis.decrby(key, amount);
        } catch (error) {
            this.logger.error(`Cache decrement error for key: ${key}`, error.stack);
            throw error;
        }
    }

    /**
     * Add to set
     */
    async addToSet(key: string, ...members: string[]): Promise<void> {
        try {
            await this.redis.sadd(key, ...members);
        } catch (error) {
            this.logger.error(`Cache add to set error for key: ${key}`, error.stack);
        }
    }

    /**
     * Get set members
     */
    async getSetMembers(key: string): Promise<string[]> {
        try {
            return await this.redis.smembers(key);
        } catch (error) {
            this.logger.error(`Cache get set members error for key: ${key}`, error.stack);
            return [];
        }
    }

    /**
     * Remove from set
     */
    async removeFromSet(key: string, ...members: string[]): Promise<void> {
        try {
            await this.redis.srem(key, ...members);
        } catch (error) {
            this.logger.error(`Cache remove from set error for key: ${key}`, error.stack);
        }
    }

    /**
     * Clear all cache (use with caution!)
     */
    async clearAll(): Promise<void> {
        try {
            await this.redis.flushdb();
            this.logger.warn('All cache cleared');
        } catch (error) {
            this.logger.error('Cache clear all error', error.stack);
        }
    }
}