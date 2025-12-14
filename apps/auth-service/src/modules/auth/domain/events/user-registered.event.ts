// apps/auth-service/src/modules/auth/domain/events/user-registered.event.ts

import { DomainEvent } from '../../../../shared/domain/events/domain-event.base';

/**
 * Event yang dipicu ketika user berhasil register
 */
export class UserRegisteredEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly role: string
    ) {
        super();
    }

    getEventName(): string {
        return 'user.registered';
    }

    getPayload(): Record<string, any> {
        return {
            userId: this.userId,
            email: this.email,
            role: this.role,
            occurredOn: this.occurredOn,
        };
    }
}