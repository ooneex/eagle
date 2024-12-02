import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class representing unauthorized access errors.
 * @template T Type of additional data stored in the exception
 */
export class UnauthorizedException<T = unknown> extends Exception<T> {
  /**
   * Creates a new UnauthorizedException.
   * @param message Error message describing the unauthorized access
   * @param data Additional data to be stored with the exception
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.Unauthorized, data);
  }
}
