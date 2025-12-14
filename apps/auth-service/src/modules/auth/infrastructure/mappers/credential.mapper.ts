// apps/auth-service/src/modules/auth/infrastructure/mappers/credential.mapper.ts

import { Injectable } from '@nestjs/common';
import { Mapper } from '../../../../shared/core/mapper.interface';
import { Credential, UserRole } from '../../domain/credential.entity';
import { CredentialOrmEntity } from '../entities/credential.orm-entity';
import { Email } from '../../../../shared/domain/value-objects/email.vo';
import { Password } from '../../../../shared/domain/value-objects/password.vo';

/**
 * Mapper untuk mengkonversi antara Domain Entity dan ORM Entity
 */
@Injectable()
export class CredentialMapper implements Mapper<Credential, CredentialOrmEntity> {
    /**
     * Convert Domain Entity to ORM Entity (untuk save ke database)
     */
    toPersistence(entity: Credential): CredentialOrmEntity {
        const ormEntity = new CredentialOrmEntity();

        ormEntity.id = entity.id;
        ormEntity.email = entity.email.value;
        ormEntity.password = entity.password.value;
        ormEntity.role = entity.role;
        ormEntity.isActive = entity.isActive;
        ormEntity.lastLoginAt = entity.lastLoginAt;
        ormEntity.createdAt = entity.createdAt;
        ormEntity.updatedAt = entity.updatedAt;
        ormEntity.deletedAt = entity.deletedAt;

        return ormEntity;
    }

    /**
     * Convert ORM Entity to Domain Entity (dari database)
     */
    toDomain(record: CredentialOrmEntity): Credential {
        const email = Email.create(record.email);
        const password = Password.fromHash(record.password);
        const role = record.role as UserRole;

        return Credential.fromPersistence(
            record.id,
            email,
            password,
            role,
            record.isActive,
            record.lastLoginAt,
            record.createdAt,
            record.updatedAt,
            record.deletedAt
        );
    }

    /**
     * Convert Domain Entity to Response DTO (optional)
     */
    toResponse(entity: Credential): any {
        return {
            id: entity.id,
            email: entity.email.value,
            role: entity.role,
            isActive: entity.isActive,
            lastLoginAt: entity.lastLoginAt,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}