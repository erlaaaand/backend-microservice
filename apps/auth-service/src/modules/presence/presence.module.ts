// apps/auth-service/src/modules/presence/presence.module.ts

import { Module } from '@nestjs/common';

// Repository
import { RedisPresenceRepository } from './infrastructure/redis-presence.repository';
import { PRESENCE_REPOSITORY } from './domain/presence.repository.port';

// Use Cases
import { SetOnlineUseCase } from './application/use-cases/set-online.use-case';
import { SetOfflineUseCase } from './application/use-cases/set-offline.use-case';
import { HeartbeatUseCase } from './application/use-cases/heartbeat.use-case';
import { GetOnlineUsersUseCase } from './application/use-cases/get-online-users.use-case';

// Controller
import { PresenceController } from './presentation/presence.controller';

@Module({
    controllers: [PresenceController],
    providers: [
        // Repository
        {
            provide: PRESENCE_REPOSITORY,
            useClass: RedisPresenceRepository,
        },

        // Use Cases
        SetOnlineUseCase,
        SetOfflineUseCase,
        HeartbeatUseCase,
        GetOnlineUsersUseCase,
    ],
    exports: [PRESENCE_REPOSITORY],
})
export class PresenceModule { }