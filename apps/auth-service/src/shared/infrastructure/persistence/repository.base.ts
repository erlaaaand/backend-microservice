// apps/auth-service/src/shared/infrastructure/persistence/repository.base.ts

import { Repository as TypeOrmRepository, EntityTarget, DataSource } from 'typeorm';
import { Repository, PaginationOptions, PaginatedResult } from '../../core/repository.interface';
import { Entity } from '../../core/entity.base';
import { Mapper } from '../../core/mapper.interface';
import { Logger } from '@nestjs/common';

/**
 * Base Repository menggunakan TypeORM
 * Implement Repository interface dengan TypeORM
 *
 * @template TEntity - Domain Entity
 * @template TDbRecord - TypeORM Entity (orm-entity)
 */
export abstract class TypeOrmRepositoryBase<
    TEntity extends Entity<any>,
    TDbRecord extends Record<string, any>,
> implements Repository<TEntity, string> {
    protected readonly repository: TypeOrmRepository<TDbRecord>;
    protected readonly logger: Logger;

    constructor(
        protected readonly entityTarget: EntityTarget<TDbRecord>,
        protected readonly dataSource: DataSource,
        protected readonly mapper: Mapper<TEntity, TDbRecord>,
        loggerContext?: string,
    ) {
        this.repository = this.dataSource.getRepository(entityTarget);
        this.logger = new Logger(loggerContext || this.constructor.name);
    }

    async save(entity: TEntity): Promise<TEntity> {
        const dbRecord = this.mapper.toPersistence(entity);
        const saved = await this.repository.save(dbRecord);
        this.logger.log(`Entity saved: ${entity.id}`);
        return this.mapper.toDomain(saved);
    }

    async saveMany(entities: TEntity[]): Promise<TEntity[]> {
        const dbRecords = entities.map(e => this.mapper.toPersistence(e));
        const saved = await this.repository.save(dbRecords);
        this.logger.log(`${saved.length} entities saved`);
        return saved.map(r => this.mapper.toDomain(r));
    }

    async findById(id: string): Promise<TEntity | null> {
        const record = await this.repository.findOne({
            where: { id } as any,
        });

        if (!record) {
            return null;
        }

        return this.mapper.toDomain(record);
    }

    async findAll(): Promise<TEntity[]> {
        const records = await this.repository.find();
        return records.map(r => this.mapper.toDomain(r));
    }

    async findPaginated(options: PaginationOptions): Promise<PaginatedResult<TEntity>> {
        const { page, limit } = options;
        const skip = (page - 1) * limit;

        const [records, total] = await this.repository.findAndCount({
            skip,
            take: limit,
        });

        const data = records.map(r => this.mapper.toDomain(r));

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async delete(id: string): Promise<void> {
        // Soft delete
        await this.repository.update(id, { deletedAt: new Date() } as any);
        this.logger.log(`Entity soft deleted: ${id}`);
    }

    async hardDelete(id: string): Promise<void> {
        await this.repository.delete(id);
        this.logger.log(`Entity hard deleted: ${id}`);
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { id } as any,
        });
        return count > 0;
    }

    async count(): Promise<number> {
        return this.repository.count();
    }

    async transaction<T>(work: () => Promise<T>): Promise<T> {
        return this.dataSource.transaction(async () => {
            return work();
        });
    }
}