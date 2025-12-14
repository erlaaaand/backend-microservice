import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmRepositoryBase } from '../../../../shared/infrastructure/persistence/repository.base';
import { AuthRepositoryPort } from '../../domain/ports/auth.repository.port';
import { Credential } from '../../domain/credential.entity';
import { CredentialOrmEntity } from '../entities/credential.orm-entity';
import { CredentialMapper } from '../mappers/credential.mapper';

/**
 * TypeORM implementation of Auth Repository
 */
@Injectable()
export class TypeOrmAuthRepository
    extends TypeOrmRepositoryBase<Credential, CredentialOrmEntity>
    implements AuthRepositoryPort {

    constructor(
        dataSource: DataSource,
        mapper: CredentialMapper
    ) {
        super(CredentialOrmEntity, dataSource, mapper, 'TypeOrmAuthRepository');
    }

    /**
     * Find credential by email
     */
    async findByEmail(email: string): Promise<Credential | null> {
        const record = await this.repository.findOne({
            where: { email: email.toLowerCase() }
        });

        if (!record) {
            return null;
        }

        return this.mapper.toDomain(record);
    }

    /**
     * [PERBAIKAN] Implementasi findByPhone
     */
    async findByPhone(phone: string): Promise<Credential | null> {
        const record = await this.repository.findOne({
            where: { phoneNumber: phone }
        });

        if (!record) {
            return null;
        }

        return this.mapper.toDomain(record);
    }

    /**
     * Check if email already exists
     */
    async emailExists(email: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { email: email.toLowerCase() }
        });

        return count > 0;
    }
}