import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class for validation errors
 * @template T Type of the validation data
 * @example
 * ```ts
 * // Create validation exception with error message
 * const validationError = new ValidationException('Invalid input');
 *
 * // Create validation exception with error data
 * const data = { field: 'email', error: 'Invalid format' };
 * const validationError = new ValidationException('Validation failed', data);
 * ```
 */
export class ValidationException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
