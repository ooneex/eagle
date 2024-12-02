import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class specific to storage decorator errors.
 * Extends the base Exception class with specific handling for storage-related issues.
 *
 * @template T Type of the data payload, defaults to unknown
 */
export class StorageDecoratorException<T = unknown> extends Exception<T> {
  /**
   * Creates a new StorageDecoratorException
   *
   * @param message Error message describing the storage exception
   * @param data Optional data payload providing additional error context
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
