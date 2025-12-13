// apps/auth-service/src/shared/infrastructure/logging/logger.service.ts

import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import { RequestContextService } from './request-context';

export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
}

interface LogMetadata {
    context?: string;
    requestId?: string;
    userId?: string;
    [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
    private context?: string;

    setContext(context: string): void {
        this.context = context;
    }

    private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
        const ctx = RequestContextService.getContext();

        const logObject = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context: metadata?.context || this.context,
            requestId: metadata?.requestId || ctx?.requestId,
            userId: metadata?.userId || ctx?.userId,
            ...metadata,
        };

        return JSON.stringify(logObject);
    }

    log(message: string, metadata?: LogMetadata): void {
        console.log(this.formatMessage(LogLevel.INFO, message, metadata));
    }

    error(message: string, trace?: string, metadata?: LogMetadata): void {
        console.error(
            this.formatMessage(LogLevel.ERROR, message, { ...metadata, trace })
        );
    }

    warn(message: string, metadata?: LogMetadata): void {
        console.warn(this.formatMessage(LogLevel.WARN, message, metadata));
    }

    debug(message: string, metadata?: LogMetadata): void {
        console.debug(this.formatMessage(LogLevel.DEBUG, message, metadata));
    }

    verbose(message: string, metadata?: LogMetadata): void {
        this.debug(message, metadata);
    }
}