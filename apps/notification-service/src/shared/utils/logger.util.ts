// logger.util.ts
import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
    log(message: string, context?: string) {
        super.log(`[${new Date().toISOString()}] ${message}`, context);
    }

    error(message: string, trace?: string, context?: string) {
        super.error(`[${new Date().toISOString()}] ${message}`, trace, context);
    }

    warn(message: string, context?: string) {
        super.warn(`[${new Date().toISOString()}] ${message}`, context);
    }

    debug(message: string, context?: string) {
        super.debug(`[${new Date().toISOString()}] ${message}`, context);
    }
}