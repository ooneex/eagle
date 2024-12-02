import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception thrown when validation of input data fails
 *
 * @template T Type of validation error data
 *
 * @example
 * ```ts
 * const error = new ValidationFailedException('Invalid input', {
 *   email: 'Email is required',
 *   password: 'Password must be at least 8 characters'
 * });
 * ```
 */
export class ValidationFailedException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.BadRequest, data);
  }
}
