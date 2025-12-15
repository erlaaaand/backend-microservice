import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICacheService } from '../../domain/ports/cache.port';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheAdapter implements ICacheService, OnModuleInit {
    private readonly logger = new Logger(RedisCacheAdapter.name);
    private client: Redis;

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        const redisConfig = this.configService.get('redis');
        this.client = new Redis(redisConfig);

        this.client.on('connect', () => {
            this.logger.log('Redis connected successfully');
        });

        this.client.on('error', (error) => {
            this.logger.error('Redis connection error:', error);
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.client.get(key);
            if (!value) return null;
            return JSON.parse(value) as T;
        } catch (error) {
            this.logger.error(`Error getting key ${key}:`, error);
            return null;
        }
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            const serialized = JSON.stringify(value);
            if (ttl) {
                await this.client.setex(key, ttl, serialized);
            } else {
                await this.client.set(key, serialized);
            }
        } catch (error) {
            this.logger.error(`Error setting key ${key}:`, error);
            throw error;
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {
            this.logger.error(`Error deleting key ${key}:`, error);
            throw error;
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            this.logger.error(`Error checking key ${key}:`, error);
            return false;
        }
    }

    async incr(key: string): Promise<number> {
        try {
            return await this.client.incr(key);
        } catch (error) {
            this.logger.error(`Error incrementing key ${key}:`, error);
            throw error;
        }
    }

    async expire(key: string, ttl: number): Promise<void> {
        try {
            await this.client.expire(key, ttl);
        } catch (error) {
            this.logger.error(`Error setting expiry for key ${key}:`, error);
            throw error;
        }
    }

    async mget(keys: string[]): Promise<any[]> {
        try {
            const values = await this.client.mget(...keys);
            return values.map((v) => (v ? JSON.parse(v) : null));
        } catch (error) {
            this.logger.error('Error in mget:', error);
            return [];
        }
    }

    async mset(entries: Record<string, any>, ttl?: number): Promise<void> {
        try {
            const pipeline = this.client.pipeline();

            for (const [key, value] of Object.entries(entries)) {
                const serialized = JSON.stringify(value);
                if (ttl) {
                    pipeline.setex(key, ttl, serialized);
                } else {
                    pipeline.set(key, serialized);
                }
            }

            await pipeline.exec();
        } catch (error) {
            this.logger.error('Error in mset:', error);
            throw error;
        }
    }

    async flushAll(): Promise<void> {
        await this.client.flushall();
    }

    getClient(): Redis {
        return this.client;
    }
}