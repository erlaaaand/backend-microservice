// apps/auth-service/src/shared/domain/events/domain-event.base.ts

/**
 * Base class untuk Domain Events
 * Domain Events digunakan untuk komunikasi antar Aggregates
 */
export abstract class DomainEvent {
    public readonly occurredOn: Date;
    public readonly eventId: string;

    constructor() {
        this.occurredOn = new Date();
        this.eventId = crypto.randomUUID();
    }

    /**
     * Nama event yang unik (digunakan untuk routing)
     */
    abstract getEventName(): string;

    /**
     * Payload yang akan dikirim
     */
    abstract getPayload(): Record<string, any>;
}