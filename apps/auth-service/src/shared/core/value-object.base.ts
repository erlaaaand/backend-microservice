// apps/auth-service/src/shared/core/value-object.base.ts

import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';

export type Primitives = string | number | boolean | Date;

/**
 * Base class untuk Value Objects dalam Domain-Driven Design
 * Value Objects adalah immutable objects yang diidentifikasi oleh nilai mereka
 *
 * Contoh: Email, Money, Address, DateRange
 */
export abstract class ValueObject<T extends Record<string, Primitives>> {
    protected readonly props: T;

    protected constructor(props: T) {
        this.checkIfEmpty(props);
        this.validate(props);
        this.props = Object.freeze(props);
    }

    /**
     * Validasi yang harus diimplementasikan oleh child class
     */
    protected abstract validate(props: T): void;

    /**
     * Cek apakah props kosong
     */
    private checkIfEmpty(props: T): void {
        if (!props || Object.keys(props).length === 0) {
            throw new ArgumentInvalidException('Value object props cannot be empty');
        }
    }

    /**
     * Value Objects dibandingkan berdasarkan nilai, bukan referensi
     */
    public equals(vo?: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.props === undefined) {
            return false;
        }
        return JSON.stringify(this.props) === JSON.stringify(vo.props);
    }

    /**
     * Getter untuk mengakses props (read-only)
     */
    public getValue(): T {
        return this.props;
    }

    /**
     * Untuk serialization (JSON.stringify)
     */
    public toJSON(): T {
        return { ...this.props };
    }
}