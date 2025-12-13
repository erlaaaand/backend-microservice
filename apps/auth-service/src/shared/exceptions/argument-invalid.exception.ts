import { ExceptionBase } from './exception.base';

/**
 * Digunakan saat validasi domain gagal.
 * Contoh: Email tidak valid, Password terlalu pendek.
 */
export class ArgumentInvalidException extends ExceptionBase {
    readonly code = 'ARGUMENT_INVALID';
}