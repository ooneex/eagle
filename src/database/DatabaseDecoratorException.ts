import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class for database decorator-related errors.
 * Extends the base Exception class with specific handling for database decorator issues.
 * @template T The type of the data associated with the exception
 */
export class DatabaseDecoratorException<T = unknown> extends Exception<T> {
  /**
   * Creates a new DatabaseDecoratorException instance
   * @param message The error message
   * @param data Optional data associated with the error
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
