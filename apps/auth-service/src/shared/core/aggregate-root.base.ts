// apps/auth-service/src/shared/core/aggregate-root.base.ts

import { Entity } from './entity.base';
import { DomainEvent } from '../domain/events/domain-event.base';

/**
 * Aggregate Root Base Class
 * 
 * Aggregate Root adalah entry point untuk mengakses Aggregate.
 * Dia manage consistency boundary dan domain events.
 * 
 * Contoh: User adalah Aggregate Root, Profile adalah bagian dari User Aggregate
 */
export abstract class AggregateRoot<TProps> extends Entity<TProps> {
    private _domainEvents: DomainEvent[] = [];

    /**
     * Get semua domain events yang belum di-dispatch
     */
    public get domainEvents(): DomainEvent[] {
        return this._domainEvents;
    }

    /**
     * Add domain event ke aggregate
     */
    protected addDomainEvent(event: DomainEvent): void {
        this._domainEvents.push(event);
    }

    /**
     * Clear domain events setelah di-dispatch
     */
    public clearDomainEvents(): void {
        this._domainEvents = [];
    }

    /**
     * Check apakah ada domain events yang pending
     */
    public hasDomainEvents(): boolean {
        return this._domainEvents.length > 0;
    }
}