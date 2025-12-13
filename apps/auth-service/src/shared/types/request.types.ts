// apps/auth-service/src/shared/types/request.types.ts

import { Request } from 'express';

/**
 * Extended Express Request with user
 */
export interface AuthRequest extends Request {
    user: {
        id: string;
        email: string;
        role: string;
    };
}