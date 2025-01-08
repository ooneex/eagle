import { Exception } from '@/exception/Exception.ts';
import { STATUS_CODE } from '@/http/status.ts';

/**
 * Exception class for handling configuration decorator related errors.
 * Extends the base Exception class to provide specialized error handling for config decorators.
 *
 * @template T The type of additional data attached to the exception
 * @extends {Exception<T>}
 */
export class ConfigDecoratorException<T = unknown> extends Exception<T> {
  /**
   * Creates a new ConfigDecoratorException instance.
   *
   * @param {string} message The error message describing what went wrong
   * @param {Readonly<Record<string, T>> | null} [data=null] Optional additional data related to the error
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
