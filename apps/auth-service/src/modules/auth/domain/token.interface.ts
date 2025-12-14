// apps/auth-service/src/modules/auth/domain/token.interface.ts

/**
 * Interface untuk Token Response
 */
export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}