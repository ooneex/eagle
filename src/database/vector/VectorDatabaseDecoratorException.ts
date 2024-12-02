import { STATUS_CODE } from 'jsr:@std/http/status';
import { Exception } from '../../exception/Exception.ts';

/**
 * Exception class for handling errors related to vector database decorator operations.
 * Extends the base Exception class with specific handling for vector database decorator context.
 *
 * @template T Type parameter for the exception data payload
 */
export class VectorDatabaseDecoratorException<T = unknown>
  extends Exception<T> {
  /**
   * Creates a new VectorDatabaseDecoratorException instance
   *
   * @param message Error message describing the exception
   * @param data Optional data payload associated with the exception
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
