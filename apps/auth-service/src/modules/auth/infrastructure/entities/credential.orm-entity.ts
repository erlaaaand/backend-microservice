// apps/auth-service/src/modules/auth/infrastructure/entities/credential.orm-entity.ts

import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

/**
 * TypeORM Entity untuk Credential
 * Mapping ke tabel database
 */
@Entity('credentials')
export class CredentialOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ unique: true, length: 255, nullable: true })
    email?: string;

    // Tambahkan kolom phone number
    @Column({ unique: true, length: 20, nullable: true })
    phoneNumber?: string;

    @Column({ length: 255 })
    password: string;

    @Column({
        type: 'enum',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    })
    role: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date | null;
}