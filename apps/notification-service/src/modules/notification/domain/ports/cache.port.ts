// Ubah dari 'interface' ke 'abstract class'
export abstract class ICacheService {
    abstract get<T>(key: string): Promise<T | null>;
    abstract set(key: string, value: any, ttl?: number): Promise<void>;
    abstract del(key: string): Promise<void>;
    abstract exists(key: string): Promise<boolean>;
    abstract incr(key: string): Promise<number>;
    abstract expire(key: string, ttl: number): Promise<void>;
    abstract mget(keys: string[]): Promise<any[]>;
    abstract mset(entries: Record<string, any>, ttl?: number): Promise<void>;
}