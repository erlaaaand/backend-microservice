import { SetMetadata } from '@nestjs/common';

// Key untuk metadata, nanti dibaca oleh RolesGuard
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);