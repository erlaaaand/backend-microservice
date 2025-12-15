// event-publisher.port.ts
export interface IEventPublisher {
    publish(pattern: string, data: any): Promise<void>;
    publishBatch(events: Array<{ pattern: string; data: any }>): Promise<void>;
}