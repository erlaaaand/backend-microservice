// apps/auth-service/src/modules/presence/application/use-cases/set-online.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.base';
import { PRESENCE_REPOSITORY, PresenceRepositoryPort } from '../../domain/presence.repository.port';
import { LoggerService } from '../../../../shared/infrastructure/logging/logger.service';

/**
 * Use Case: Set user as online
 */
@Injectable()
export class SetOnlineUseCase implements UseCase<string, void> {
    constructor(
        @Inject(PRESENCE_REPOSITORY)
        private readonly presenceRepository: PresenceRepositoryPort,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('SetOnlineUseCase');
    }

    async execute(userId: string): Promise<void> {
        this.logger.log('Setting user online', { userId });

        await this.presenceRepository.setOnline(userId);

        this.logger.log('User set to online successfully', { userId });
    }
}