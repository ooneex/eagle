import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class specifically for handling repository decorator related errors.
 * Extends the base Exception class with support for generic type T.
 *
 * @template T The type of data associated with the exception
 */
export class RepositoryDecoratorException<T = unknown> extends Exception<T> {
  /**
   * Creates a new RepositoryDecoratorException instance
   *
   * @param message Error message describing the exception
   * @param data Optional readonly record containing additional error data
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
