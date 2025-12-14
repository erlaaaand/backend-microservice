// apps/auth-service/src/shared/api/guards/jwt-auth.guard.ts

import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JWT Auth Guard with support for @Public() decorator
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector?: Reflector) {
        super();
    }

    /**
     * Check if route is marked as public
     */
    canActivate(context: ExecutionContext) {
        // Check if route is marked as public
        const isPublic = this.reflector?.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If public, skip authentication
        if (isPublic) {
            return true;
        }

        // Otherwise, perform JWT authentication
        return super.canActivate(context);
    }

    /**
     * Override default behavior to control
     * what happens after JWT validation
     */
    handleRequest(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext,
    ) {
        // Jika terjadi error dari strategy
        if (err) {
            throw err;
        }

        // Jika token tidak valid / tidak ada user
        if (!user) {
            throw new UnauthorizedException(
                info?.message || 'Unauthorized access',
            );
        }

        // Jika valid → user akan disimpan di request.user
        return user;
    }
}