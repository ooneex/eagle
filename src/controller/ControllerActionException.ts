import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class for controller action errors.
 *
 * Used when an error occurs within a controller action that needs to be
 * handled and returned as an internal server error.
 *
 * @template T Type of the exception data
 */
export class ControllerActionException<T = unknown> extends Exception<T> {
  /**
   * Creates a new ControllerActionException
   *
   * @param message Error message
   * @param data Optional error data object
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
