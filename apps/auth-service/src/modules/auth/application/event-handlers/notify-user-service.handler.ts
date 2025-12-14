// apps/auth-service/src/modules/auth/application/event-handlers/notify-user-service.handler.ts

import { Injectable } from '@nestjs/common';
import { EventHandler } from '../../../../shared/domain/events/event-handler.interface';
import { UserRegisteredEvent } from '../../domain/events/user-registered.event';
import { LoggerService } from '../../../../shared/infrastructure/logging/logger.service';

/**
 * Event Handler: Notify User Service about new registration
 * Ini adalah contoh handler tambahan yang bisa mengirim notifikasi internal
 * atau melakukan operasi lain setelah user register
 */
@Injectable()
export class NotifyUserServiceHandler implements EventHandler<UserRegisteredEvent> {
    constructor(private readonly logger: LoggerService) {
        this.logger.setContext('NotifyUserServiceHandler');
    }

    async handle(event: UserRegisteredEvent): Promise<void> {
        this.logger.log('Notifying user service about new registration', {
            userId: event.userId,
        });

        try {
            // Ini adalah placeholder untuk logic notifikasi
            // Bisa berupa:
            // 1. HTTP call ke User Service
            // 2. Publish ke message broker lain
            // 3. Update cache
            // 4. Log ke analytics

            // Contoh: Log untuk tracking
            this.logger.log('User service notified successfully', {
                userId: event.userId,
                email: event.email,
            });
        } catch (error) {
            this.logger.error(
                'Failed to notify user service',
                error.stack,
                { userId: event.userId }
            );
            // Don't throw error, agar tidak mengganggu flow utama
        }
    }
}