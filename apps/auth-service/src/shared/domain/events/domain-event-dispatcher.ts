// apps/auth-service/src/shared/domain/events/domain-event-dispatcher.ts

import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { DomainEvent } from './domain-event.base';
import { EventHandler } from './event-handler.interface';

/**
 * Domain Event Dispatcher
 * Mengirim event ke handler yang sesuai
 */
@Injectable()
export class DomainEventDispatcher {
    private handlers = new Map<string, Type<EventHandler<any>>[]>();

    constructor(private readonly moduleRef: ModuleRef) { }

    /**
     * Register event handler
     */
    register<T extends DomainEvent>(
        eventName: string,
        handler: Type<EventHandler<T>>,
    ): void {
        const existing = this.handlers.get(eventName) || [];
        existing.push(handler);
        this.handlers.set(eventName, existing);
    }

    /**
     * Dispatch event ke semua handler yang terdaftar
     */
    async dispatch(event: DomainEvent): Promise<void> {
        const eventName = event.getEventName();
        const handlers = this.handlers.get(eventName) || [];

        for (const HandlerClass of handlers) {
            try {
                const handler = this.moduleRef.get(HandlerClass, { strict: false });
                await handler.handle(event);
            } catch (error) {
                console.error(`Error handling event ${eventName}:`, error);
                // Log error tapi jangan throw agar handler lain tetap jalan
            }
        }
    }

    /**
     * Dispatch multiple events
     */
    async dispatchAll(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            await this.dispatch(event);
        }
    }
}