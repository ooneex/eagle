import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class specifically for handling service decorator-related errors.
 * Extends the base Exception class with a default 500 Internal Server Error status code.
 *
 * @template T Type of additional data that can be attached to the exception
 */
export class ServiceDecoratorException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
