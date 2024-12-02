import { Cookie } from 'jsr:@std/http@1.0.10/cookie';
import { IReadonlyArrayCollection } from '../collection/types.ts';
import { Header } from '../header/Header.ts';
import { CharsetType, StatusCodeType } from '../http/types.ts';
import { IRequest } from '../request/types.ts';

/**
 * Interface for handling HTTP responses.
 */
export interface IResponse {
  /** HTTP headers collection */
  readonly header: Header;
  /** HTTP cookies collection */
  readonly cookies: IReadonlyArrayCollection<Cookie>;
  /**
   * Sets plain text response
   * @param content Text content
   * @param status HTTP status code
   * @param charset Character encoding
   */
  text: (
    content: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => this;
  /**
   * Sets HTML response
   * @param content HTML content
   * @param status HTTP status code
   * @param charset Character encoding
   */
  html: (
    content: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => this;
  /**
   * Sets JSON response
   * @param data Object to serialize to JSON
   * @param status HTTP status code
   * @param charset Character encoding
   */
  json: (
    data: Record<string, unknown>,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => this;
  /**
   * Sets streaming response
   * @param data String or stream to send
   * @param status HTTP status code
   */
  stream: (data: string | ReadableStream, status?: StatusCodeType) => this;
  /**
   * Sets exception response
   * @param message Error message
   * @param data Additional error data
   * @param status HTTP status code
   */
  exception: (
    message: string,
    data?: Record<string, unknown> | null,
    status?: StatusCodeType,
  ) => this;
  /**
   * Sets not found response
   * @param message Not found message
   * @param data Additional error data
   * @param status HTTP status code
   */
  notFound: (
    message: string,
    data?: Record<string, unknown> | null,
    status?: StatusCodeType,
  ) => this;
  /**
   * Redirects to URL
   * @param url Redirect URL
   * @param status HTTP status code
   */
  redirect: (url: string | URL, status?: StatusCodeType) => Response;
  /** Gets response data */
  getData: () => Record<string, unknown>;
  /**
   * Builds response
   * @param request Original request
   */
  build: (request: IRequest) => Response;
  /** Checks if status is 2xx */
  isSuccessful: () => boolean;
  /** Checks if status is 1xx */
  isInformational: () => boolean;
  /** Checks if status is 3xx */
  isRedirect: () => boolean;
  /** Checks if status is 4xx */
  isClientError: () => boolean;
  /** Checks if status is 5xx */
  isServerError: () => boolean;
  /** Checks if status is 4xx or 5xx */
  isError: () => boolean;
}
