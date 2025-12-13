// apps/auth-service/src/shared/domain/events/event-handler.interface.ts

import { DomainEvent } from "./domain-event.base";

/**
 * Interface untuk Domain Event Handler
 * Setiap handler harus implement interface ini
 */
export interface EventHandler<T extends DomainEvent> {
    handle(event: T): Promise<void> | void;
}