import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception'
export interface BaseEntityProps {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null; // [BARU] Tambahan untuk Soft Delete
}

export abstract class Entity<TProps> {
    protected readonly _id: string;
    protected readonly _createdAt: Date;
    protected _updatedAt: Date;
    protected _deletedAt: Date | null; // [BARU]
    protected readonly props: TProps;

    constructor(
        props: TProps,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date | null // [BARU]
    ) {
        this._id = id ? id : crypto.randomUUID();
        this._createdAt = createdAt ? createdAt : new Date();
        this._updatedAt = updatedAt ? updatedAt : new Date();
        this._deletedAt = deletedAt || null; // Default null (belum dihapus)
        this.props = props;

        this.validate();
    }

    // Getters standard
    get id(): string { return this._id; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }
    get deletedAt(): Date | null { return this._deletedAt; } // [BARU] Getter

    // Serialization: Update untuk menyertakan deletedAt
    public getProps(): TProps & BaseEntityProps {
        const propsCopy = {
            id: this._id,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            deletedAt: this._deletedAt, // [BARU]
            ...this.props,
        };
        return Object.freeze(propsCopy);
    }

    public abstract validate(): void;

    // Equality Check
    public equals(object?: Entity<TProps>): boolean {
        if (object === null || object === undefined) {
            return false;
        }
        if (this === object) {
            return true;
        }
        if (!(object instanceof Entity)) {
            return false;
        }
        return this._id === object._id;
    }

    // Helper: Cek apakah entity ini sudah dihapus (soft deleted)
    public isDeleted(): boolean {
        return this._deletedAt !== null;
    }
}