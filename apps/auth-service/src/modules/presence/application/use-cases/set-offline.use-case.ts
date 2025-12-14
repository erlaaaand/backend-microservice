// apps/auth-service/src/modules/presence/application/use-cases/set-offline.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.base';
import { PRESENCE_REPOSITORY, PresenceRepositoryPort } from '../../domain/presence.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logging/logger.service';

/**
 * Use Case: Set user as offline
 */
@Injectable()
export class SetOfflineUseCase implements UseCase<string, void> {
    constructor(
        @Inject(PRESENCE_REPOSITORY)
        private readonly presenceRepository: PresenceRepositoryPort,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('SetOfflineUseCase');
    }

    async execute(userId: string): Promise<void> {
        this.logger.log('Setting user offline', { userId });

        await this.presenceRepository.setOffline(userId);

        this.logger.log('User set to offline successfully', { userId });
    }
}