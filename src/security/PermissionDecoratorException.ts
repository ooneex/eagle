import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class for permission-related errors in decorators.
 * Used when there are issues with permission checks or authorization in decorator usage.
 *
 * @template T The type of the additional data associated with the exception
 */
export class PermissionDecoratorException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
