import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { Exception } from '../exception/Exception.ts';

/**
 * Exception class specifically for handling errors that occur in mailer decorators.
 * Extends the base Exception class with a default InternalServerError status code.
 *
 * @template T The type of data that can be attached to the exception
 */
export class MailerDecoratorException<T = unknown> extends Exception<T> {
  /**
   * Creates a new MailerDecoratorException instance
   * @param message The error message
   * @param data Optional data object to attach to the exception
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
