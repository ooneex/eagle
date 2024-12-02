import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { Exception } from '../exception/Exception.ts';

/**
 * MailerException represents an error that occurs during mailing operations.
 * Extends the base Exception class with a default status code of Internal Server Error.
 *
 * @template T Generic type for the error data payload
 */
export class MailerException<T = unknown> extends Exception<T> {
  /**
   * Creates a new MailerException instance.
   *
   * @param message Error message describing the mailing error
   * @param data Optional error data payload object
   */
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
