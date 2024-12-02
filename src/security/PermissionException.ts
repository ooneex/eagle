import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception thrown when a user does not have sufficient permissions to perform an action.
 *
 * @template T The type of additional data associated with the exception
 */
export class PermissionException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.Unauthorized, data);
  }
}
