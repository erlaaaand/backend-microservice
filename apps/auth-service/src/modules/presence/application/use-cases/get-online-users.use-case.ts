// apps/auth-service/src/modules/presence/application/use-cases/get-online-users.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/use-case.base';
import { PRESENCE_REPOSITORY, PresenceRepositoryPort } from '../../domain/presence.repository.port';
import { OnlineUsersResponseDto } from '../dto/user-status.response.dto';
import { LoggerService } from '../../../../shared/infrastructure/logging/logger.service';

/**
 * Use Case: Get all online users
 */
@Injectable()
export class GetOnlineUsersUseCase implements UseCase<void, OnlineUsersResponseDto> {
    constructor(
        @Inject(PRESENCE_REPOSITORY)
        private readonly presenceRepository: PresenceRepositoryPort,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('GetOnlineUsersUseCase');
    }

    async execute(): Promise<OnlineUsersResponseDto> {
        this.logger.debug('Getting online users');

        const userIds = await this.presenceRepository.getOnlineUsers();

        this.logger.debug('Online users retrieved', { count: userIds.length });

        return {
            userIds,
            count: userIds.length,
        };
    }
}