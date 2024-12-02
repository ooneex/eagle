import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { Exception } from '../../exception/Exception.ts';

/**
 * Exception class for vector database related errors.
 *
 * @template T The type of the error data
 * @throws {Exception} Throws with InternalServerError status code
 */
export class VectorDatabaseException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
