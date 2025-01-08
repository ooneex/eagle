import { STATUS_CODE } from '@/http/status.ts';
import { Exception } from './Exception.ts';

/**
 * Exception class for handling 404 Not Found errors.
 * Extends the base Exception class with NotFound status code.
 *
 * @template T Type of additional data attached to the exception
 */
export class NotFoundException<T = unknown> extends Exception<T> {
  /**
   * Creates a new NotFoundException instance
   *
   * @param message Error message describing what was not found
   * @param data Optional additional data to attach to the exception
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.NotFound, data);
  }
}
