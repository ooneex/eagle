import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class specifically for handling errors related to seed decorators.
 * @template T - The type of data associated with the exception
 * @extends {Exception<T>}
 */
export class SeedDecoratorException<T = unknown> extends Exception<T> {
  /**
   * Creates a new SeedDecoratorException instance.
   * @param {string} message - The error message
   * @param {Readonly<Record<string, T>> | null} [data=null] - Additional data associated with the exception
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
