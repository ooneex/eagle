import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception thrown when there are errors related to the dependency injection container.
 * Extends the base Exception class with container-specific functionality.
 * @template T Type of the exception data
 */
export class ContainerException<T = unknown> extends Exception<T> {
  /**
   * Creates a new ContainerException instance
   * @param message Error message describing the container exception
   * @param data Optional data associated with the exception
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
