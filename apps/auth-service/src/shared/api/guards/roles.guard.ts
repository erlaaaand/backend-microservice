import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // 1. Ambil role yang dibutuhkan endpoint (dari decorator @Roles)
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Jika tidak ada batasan role, izinkan lewat
        if (!requiredRoles) {
            return true;
        }

        // 2. Ambil user dari request (hasil validasi JWT)
        const { user } = context.switchToHttp().getRequest();

        // 3. Cek apakah user memiliki salah satu role yang dibutuhkan
        return requiredRoles.some((role) => user.role === role);
    }
}