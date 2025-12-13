
// apps/auth-service/src/shared/api/decorators/public.decorator.ts

import { SetMetadata } from '@nestjs/common';

/**
 * Decorator untuk endpoint yang tidak memerlukan authentication
 * Usage: @Public()
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);