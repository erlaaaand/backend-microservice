// apps/auth-service/src/shared/api/guards/ownership.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Guard untuk memastikan user hanya bisa akses resource miliknya sendiri
 * Kecuali user adalah ADMIN
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const resourceUserId = request.params.userId || request.params.id;

        // Admin bisa akses semua resource
        if (user.role === 'ADMIN') {
            return true;
        }

        // User biasa hanya bisa akses resource miliknya
        if (user.id !== resourceUserId) {
            throw new ForbiddenException('You can only access your own resources');
        }

        return true;
    }
}