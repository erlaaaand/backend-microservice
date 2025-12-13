/**
 * Interface untuk mengubah bentuk data antar layer.
 * DomainEntity: Class murni (Logic).
 * DbRecord: Class TypeORM (Database).
 * ResponseDto: JSON untuk Frontend.
 */
export interface Mapper<DomainEntity, DbRecord, ResponseDto = any> {
    toPersistence(entity: DomainEntity): DbRecord;
    toDomain(record: DbRecord): DomainEntity;
    toResponse?(entity: DomainEntity): ResponseDto;
}