import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception thrown during middleware decoration process.
 * This exception is used when there is an error in applying or configuring middleware decorators.
 * @template T Type of additional data associated with the exception
 */
export class MiddlewareDecoratorException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
