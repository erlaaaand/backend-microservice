// apps/auth-service/src/shared/types/jwt-payload.types.ts

/**
 * JWT Payload types
 */
export interface JwtPayload {
    sub: string;          // User ID
    email: string;
    role: string;
    iat?: number;         // Issued at
    exp?: number;         // Expiration
}

export interface RefreshTokenPayload {
    sub: string;          // User ID
    iat?: number;
    exp?: number;
}