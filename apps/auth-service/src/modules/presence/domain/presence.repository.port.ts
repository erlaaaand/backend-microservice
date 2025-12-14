// apps/auth-service/src/modules/presence/domain/presence.repository.port.ts

/**
 * Port/Interface untuk Presence Repository
 * Menggunakan Redis untuk menyimpan status user online/offline
 */
export interface PresenceRepositoryPort {
    /**
     * Set user as online
     */
    setOnline(userId: string): Promise<void>;

    /**
     * Set user as offline
     */
    setOffline(userId: string): Promise<void>;

    /**
     * Update last activity (heartbeat)
     */
    updateActivity(userId: string): Promise<void>;

    /**
     * Check if user is online
     */
    isOnline(userId: string): Promise<boolean>;

    /**
     * Get all online users
     */
    getOnlineUsers(): Promise<string[]>;

    /**
     * Get user last seen timestamp
     */
    getLastSeen(userId: string): Promise<Date | null>;
}

// Token untuk dependency injection
export const PRESENCE_REPOSITORY = Symbol('PRESENCE_REPOSITORY');