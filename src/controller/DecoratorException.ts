import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class for handling errors that occur during decorator execution
 *
 * @class DecoratorException
 * @extends {Exception<T>}
 * @template T Type of additional data passed with the exception
 */
export class DecoratorException<T = unknown> extends Exception<T> {
  /**
   * Creates a new instance of DecoratorException
   *
   * @constructor
   * @param {string} message - Error message describing what went wrong
   * @param {Readonly<Record<string, T>> | null} [data=null] - Optional additional data associated with the error
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
