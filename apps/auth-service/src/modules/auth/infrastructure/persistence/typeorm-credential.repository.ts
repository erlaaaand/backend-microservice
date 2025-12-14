// apps/auth-service/src/modules/auth/infrastructure/persistence/typeorm-credential.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepo } from 'typeorm';
import { CredentialOrmEntity } from '../entities/credential.orm-entity';
import { Credential } from '../../domain/credential.entity';
import { CredentialMapper } from '../mappers/credential.mapper';
import { LoggerService } from '../../../../shared/infrastructure/logging/logger.service';
import { PaginationOptions, PaginatedResult } from '../../../../shared/core/repository.interface';

/**
 * TypeORM Credential Repository
 * Alternative implementation jika tidak menggunakan TypeOrmRepositoryBase
 *
 * NOTE: File ini adalah alternative dari typeorm-auth.repository.ts
 * Pilih salah satu sesuai preference:
 * - Gunakan typeorm-auth.repository.ts jika ingin extend dari base class
 * - Gunakan file ini jika ingin implementasi manual lengkap
 */
@Injectable()
export class TypeOrmCredentialRepository {
    constructor(
        @InjectRepository(CredentialOrmEntity)
        private readonly ormRepository: TypeOrmRepo<CredentialOrmEntity>,
        private readonly mapper: CredentialMapper,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('TypeOrmCredentialRepository');
    }

    /**
     * Save credential (insert or update)
     */
    async save(entity: Credential): Promise<Credential> {
        try {
            const ormEntity = this.mapper.toPersistence(entity);
            const saved = await this.ormRepository.save(ormEntity);

            this.logger.debug('Credential saved', { id: saved.id });

            return this.mapper.toDomain(saved);
        } catch (error) {
            this.logger.error('Failed to save credential', error.stack, {
                entityId: entity.id
            });
            throw error;
        }
    }

    /**
     * Save multiple credentials
     */
    async saveMany(entities: Credential[]): Promise<Credential[]> {
        try {
            const ormEntities = entities.map(e => this.mapper.toPersistence(e));
            const saved = await this.ormRepository.save(ormEntities);

            this.logger.debug('Multiple credentials saved', { count: saved.length });

            return saved.map(e => this.mapper.toDomain(e));
        } catch (error) {
            this.logger.error('Failed to save multiple credentials', error.stack);
            throw error;
        }
    }

    /**
     * Find credential by ID
     */
    async findById(id: string): Promise<Credential | null> {
        try {
            const ormEntity = await this.ormRepository.findOne({
                where: { id }
            });

            if (!ormEntity) {
                return null;
            }

            return this.mapper.toDomain(ormEntity);
        } catch (error) {
            this.logger.error('Failed to find credential by ID', error.stack, { id });
            throw error;
        }
    }

    /**
     * Find credential by email
     */
    async findByEmail(email: string): Promise<Credential | null> {
        try {
            const ormEntity = await this.ormRepository.findOne({
                where: { email: email.toLowerCase() }
            });

            if (!ormEntity) {
                this.logger.debug('Credential not found by email', { email });
                return null;
            }

            return this.mapper.toDomain(ormEntity);
        } catch (error) {
            this.logger.error('Failed to find credential by email', error.stack, { email });
            throw error;
        }
    }

    /**
     * Find all credentials
     */
    async findAll(): Promise<Credential[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: { deletedAt: null as any }
            });

            return ormEntities.map(e => this.mapper.toDomain(e));
        } catch (error) {
            this.logger.error('Failed to find all credentials', error.stack);
            throw error;
        }
    }

    /**
     * Find with pagination
     */
    async findPaginated(options: PaginationOptions): Promise<PaginatedResult<Credential>> {
        try {
            const { page, limit } = options;
            const skip = (page - 1) * limit;

            const [ormEntities, total] = await this.ormRepository.findAndCount({
                where: { deletedAt: null as any },
                skip,
                take: limit,
                order: { createdAt: 'DESC' }
            });

            const data = ormEntities.map(e => this.mapper.toDomain(e));

            return {
                data,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            this.logger.error('Failed to find paginated credentials', error.stack, options);
            throw error;
        }
    }

    /**
     * Check if email exists
     */
    async emailExists(email: string): Promise<boolean> {
        try {
            const count = await this.ormRepository.count({
                where: {
                    email: email.toLowerCase(),
                    deletedAt: null as any
                }
            });

            return count > 0;
        } catch (error) {
            this.logger.error('Failed to check email existence', error.stack, { email });
            throw error;
        }
    }

    /**
     * Check if credential exists by ID
     */
    async exists(id: string): Promise<boolean> {
        try {
            const count = await this.ormRepository.count({
                where: {
                    id,
                    deletedAt: null as any
                }
            });

            return count > 0;
        } catch (error) {
            this.logger.error('Failed to check credential existence', error.stack, { id });
            throw error;
        }
    }

    /**
     * Count total credentials
     */
    async count(): Promise<number> {
        try {
            return await this.ormRepository.count({
                where: { deletedAt: null as any }
            });
        } catch (error) {
            this.logger.error('Failed to count credentials', error.stack);
            throw error;
        }
    }

    /**
     * Soft delete credential
     */
    async delete(id: string): Promise<void> {
        try {
            await this.ormRepository.update(id, {
                deletedAt: new Date()
            });

            this.logger.log('Credential soft deleted', { id });
        } catch (error) {
            this.logger.error('Failed to soft delete credential', error.stack, { id });
            throw error;
        }
    }

    /**
     * Hard delete credential (permanent)
     */
    async hardDelete(id: string): Promise<void> {
        try {
            await this.ormRepository.delete(id);

            this.logger.warn('Credential hard deleted', { id });
        } catch (error) {
            this.logger.error('Failed to hard delete credential', error.stack, { id });
            throw error;
        }
    }

    /**
     * Execute in transaction
     */
    async transaction<T>(work: () => Promise<T>): Promise<T> {
        const queryRunner = this.ormRepository.manager.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await work();
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Transaction failed', error.stack);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Find by role
     */
    async findByRole(role: string): Promise<Credential[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: {
                    role,
                    deletedAt: null as any
                }
            });

            return ormEntities.map(e => this.mapper.toDomain(e));
        } catch (error) {
            this.logger.error('Failed to find credentials by role', error.stack, { role });
            throw error;
        }
    }

    /**
     * Find active credentials
     */
    async findActive(): Promise<Credential[]> {
        try {
            const ormEntities = await this.ormRepository.find({
                where: {
                    isActive: true,
                    deletedAt: null as any
                }
            });

            return ormEntities.map(e => this.mapper.toDomain(e));
        } catch (error) {
            this.logger.error('Failed to find active credentials', error.stack);
            throw error;
        }
    }

    /**
     * Count by role
     */
    async countByRole(role: string): Promise<number> {
        try {
            return await this.ormRepository.count({
                where: {
                    role,
                    deletedAt: null as any
                }
            });
        } catch (error) {
            this.logger.error('Failed to count credentials by role', error.stack, { role });
            throw error;
        }
    }
}