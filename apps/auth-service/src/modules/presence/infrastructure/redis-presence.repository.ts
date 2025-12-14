// apps/auth-service/src/modules/presence/infrastructure/redis-presence.repository.ts

import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../../shared/infrastructure/config/redis.config';
import { PresenceRepositoryPort } from '../domain/presence.repository.port';
import { LoggerService } from '../../../shared/infrastructure/logging/logger.service';

/**
 * Redis implementation of Presence Repository
 * Menggunakan Redis untuk tracking user online status
 */
@Injectable()
export class RedisPresenceRepository implements PresenceRepositoryPort {
    private readonly ONLINE_PREFIX = 'user_online:';
    private readonly ONLINE_SET_KEY = 'online_users';
    private readonly TTL_SECONDS = 300; // 5 minutes

    constructor(
        @Inject(REDIS_CLIENT)
        private readonly redis: Redis,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('RedisPresenceRepository');
    }

    async setOnline(userId: string): Promise<void> {
        const key = this.getOnlineKey(userId);
        const timestamp = new Date().toISOString();

        await this.redis
            .pipeline()
            .set(key, timestamp, 'EX', this.TTL_SECONDS)
            .sadd(this.ONLINE_SET_KEY, userId)
            .exec();

        this.logger.debug(`User set to online`, { userId });
    }

    async setOffline(userId: string): Promise<void> {
        const key = this.getOnlineKey(userId);

        await this.redis
            .pipeline()
            .del(key)
            .srem(this.ONLINE_SET_KEY, userId)
            .exec();

        this.logger.debug(`User set to offline`, { userId });
    }

    async updateActivity(userId: string): Promise<void> {
        const key = this.getOnlineKey(userId);
        const timestamp = new Date().toISOString();

        await this.redis
            .pipeline()
            .set(key, timestamp, 'EX', this.TTL_SECONDS)
            .sadd(this.ONLINE_SET_KEY, userId)
            .exec();

        this.logger.debug(`User activity updated`, { userId });
    }

    async isOnline(userId: string): Promise<boolean> {
        const key = this.getOnlineKey(userId);
        const exists = await this.redis.exists(key);
        return exists === 1;
    }

    async getOnlineUsers(): Promise<string[]> {
        const userIds = await this.redis.smembers(this.ONLINE_SET_KEY);

        // Verify each user is still online (check if key exists)
        const validUsers: string[] = [];
        for (const userId of userIds) {
            const isOnline = await this.isOnline(userId);
            if (isOnline) {
                validUsers.push(userId);
            } else {
                // Clean up stale data
                await this.redis.srem(this.ONLINE_SET_KEY, userId);
            }
        }

        return validUsers;
    }

    async getLastSeen(userId: string): Promise<Date | null> {
        const key = this.getOnlineKey(userId);
        const timestamp = await this.redis.get(key);

        if (!timestamp) {
            return null;
        }

        return new Date(timestamp);
    }

    private getOnlineKey(userId: string): string {
        return `${this.ONLINE_PREFIX}${userId}`;
    }
}