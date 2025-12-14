// apps/auth-service/src/modules/presence/application/use-cases/heartbeat.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.base';
import { PRESENCE_REPOSITORY, PresenceRepositoryPort } from '../../domain/presence.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logging/logger.service';

/**
 * Use Case: Update user activity (heartbeat)
 * Called periodically to keep user online status
 */
@Injectable()
export class HeartbeatUseCase implements UseCase<string, void> {
    constructor(
        @Inject(PRESENCE_REPOSITORY)
        private readonly presenceRepository: PresenceRepositoryPort,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('HeartbeatUseCase');
    }

    async execute(userId: string): Promise<void> {
        this.logger.debug('Updating user activity', { userId });

        await this.presenceRepository.updateActivity(userId);
    }
}