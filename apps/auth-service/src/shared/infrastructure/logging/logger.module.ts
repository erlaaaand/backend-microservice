// apps/auth-service/src/shared/infrastructure/logging/logger.module.ts

import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule { }