// apps/auth-service/src/shared/infrastructure/logging/request-context.ts

import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
    requestId: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
    timestamp: Date;
}

export class RequestContextService {
    private static asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

    static run(context: RequestContext, callback: () => void): void {
        this.asyncLocalStorage.run(context, callback);
    }

    static getContext(): RequestContext | undefined {
        return this.asyncLocalStorage.getStore();
    }

    static getRequestId(): string | undefined {
        return this.getContext()?.requestId;
    }

    static getUserId(): string | undefined {
        return this.getContext()?.userId;
    }
}