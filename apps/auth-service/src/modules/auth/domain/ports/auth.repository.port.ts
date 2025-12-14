// apps/auth-service/src/modules/auth/domain/ports/auth.repository.port.ts

import { Repository } from '../../../../shared/core/repository.interface';
import { Credential } from '../credential.entity';

/**
 * Port/Interface untuk Auth Repository
 * Mendefinisikan contract yang harus diimplementasi oleh infrastructure layer
 */
export interface AuthRepositoryPort extends Repository<Credential, string> {
    /**
     * Find credential by email
     */
    findByEmail(email: string): Promise<Credential | null>;

    /**
     * Check if email already exists
     */
    emailExists(email: string): Promise<boolean>;

    /**
     * Find credential by phone
     * @param phone
     */

    findByPhone(phone: string): Promise<Credential | null>; // Tambahan
}

// Token untuk dependency injection
export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');