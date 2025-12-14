// apps/auth-service/src/modules/auth/domain/credential.entity.ts

import { AggregateRoot } from '../../../shared/core/aggregate-root.base';
import { Email } from '../../../shared/domain/value-objects/email.vo';
import { Password } from '../../../shared/domain/value-objects/password.vo';
import { ArgumentInvalidException } from '../../../shared/exceptions/argument-invalid.exception';
import { UserRegisteredEvent } from './events/user-registered.event';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

interface CredentialProps {
    email: Email;
    password: Password;
    role: UserRole;
    isActive: boolean;
    lastLoginAt?: Date;
}

/**
 * Credential Aggregate Root
 * Mengelola autentikasi dan otorisasi user
 */
export class Credential extends AggregateRoot<CredentialProps> {
    get email(): Email {
        return this.props.email;
    }

    get password(): Password {
        return this.props.password;
    }

    get role(): UserRole {
        return this.props.role;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get lastLoginAt(): Date | undefined {
        return this.props.lastLoginAt;
    }

    private constructor(
        props: CredentialProps,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date | null
    ) {
        super(props, id, createdAt, updatedAt, deletedAt);
    }

    /**
     * Factory method untuk membuat credential baru
     */
    public static create(
        email: Email,
        password: Password,
        role: UserRole = UserRole.USER
    ): Credential {
        const credential = new Credential({
            email,
            password,
            role,
            isActive: true,
        });

        // Emit domain event
        credential.addDomainEvent(
            new UserRegisteredEvent(
                credential.id,
                email.value,
                role
            )
        );

        return credential;
    }

    /**
     * Factory method untuk reconstruct dari database
     */
    public static fromPersistence(
        id: string,
        email: Email,
        password: Password,
        role: UserRole,
        isActive: boolean,
        lastLoginAt?: Date,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date | null
    ): Credential {
        return new Credential(
            { email, password, role, isActive, lastLoginAt },
            id,
            createdAt,
            updatedAt,
            deletedAt
        );
    }

    /**
     * Verify password
     */
    public async verifyPassword(plainPassword: string): Promise<boolean> {
        if (!this.isActive) {
            throw new ArgumentInvalidException('Account is not active');
        }
        return this.password.compare(plainPassword);
    }

    /**
     * Update last login
     */
    public updateLastLogin(): void {
        this.props.lastLoginAt = new Date();
        this._updatedAt = new Date();
    }

    /**
     * Change password
     */
    public changePassword(newPassword: Password): void {
        this.props.password = newPassword;
        this._updatedAt = new Date();
    }

    /**
     * Deactivate account
     */
    public deactivate(): void {
        this.props.isActive = false;
        this._updatedAt = new Date();
    }

    /**
     * Activate account
     */
    public activate(): void {
        this.props.isActive = true;
        this._updatedAt = new Date();
    }

    /**
     * Upgrade to admin
     */
    public upgradeToAdmin(): void {
        this.props.role = UserRole.ADMIN;
        this._updatedAt = new Date();
    }

    public validate(): void {
        if (!this.props.email) {
            throw new ArgumentInvalidException('Email is required');
        }
        if (!this.props.password) {
            throw new ArgumentInvalidException('Password is required');
        }
        if (!this.props.role) {
            throw new ArgumentInvalidException('Role is required');
        }
    }
}