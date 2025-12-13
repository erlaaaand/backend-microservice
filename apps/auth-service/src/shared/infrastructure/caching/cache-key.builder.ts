// apps/auth-service/src/shared/infrastructure/caching/cache-key.builder.ts

/**
 * Builder untuk membuat cache key yang konsisten
 */
export class CacheKeyBuilder {
    private parts: string[] = [];

    /**
     * Add service prefix
     */
    service(name: string): this {
        this.parts.push(name);
        return this;
    }

    /**
     * Add entity type
     */
    entity(name: string): this {
        this.parts.push(name);
        return this;
    }

    /**
     * Add entity ID
     */
    id(id: string | number): this {
        this.parts.push(String(id));
        return this;
    }

    /**
     * Add custom part
     */
    part(part: string): this {
        this.parts.push(part);
        return this;
    }

    /**
     * Build the final key
     */
    build(): string {
        return this.parts.join(':');
    }

    /**
     * Static helper for quick key creation
     */
    static create(): CacheKeyBuilder {
        return new CacheKeyBuilder();
    }
}