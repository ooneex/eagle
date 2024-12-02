import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class for validator decorator errors
 *
 * @typeParam T - Type of the exception data object
 *
 * @example
 * ```ts
 * const exception = new ValidatorDecoratorException('Validation failed', {
 *   field: 'name',
 *   error: 'Required field is missing'
 * });
 * ```
 */
export class ValidatorDecoratorException<T = unknown> extends Exception<T> {
  /**
   * Creates a new validator decorator exception
   *
   * @param message - Error message
   * @param data - Additional error data
   *
   * @example
   * ```ts
   * throw new ValidatorDecoratorException('Invalid input', {
   *   field: 'email',
   *   error: 'Invalid email format'
   * });
   * ```
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
