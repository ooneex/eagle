import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../exception/Exception.ts';

/**
 * StorageException represents a custom error class for storage-related errors.
 * It extends the base Exception class and handles storage-specific error cases.
 *
 * @template T The type parameter for error data (defaults to unknown)
 * @extends {Exception<T>}
 */
export class StorageException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
