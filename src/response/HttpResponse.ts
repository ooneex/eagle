import { Cookie, setCookie } from 'jsr:@std/http/cookie';
import {
  isClientErrorStatus,
  isErrorStatus,
  isInformationalStatus,
  isRedirectStatus,
  isServerErrorStatus,
  isSuccessfulStatus,
  STATUS_TEXT,
} from 'jsr:@std/http/status';
import { ArrayCollection } from '../collection/mod.ts';
import { Header } from '../header/Header.ts';
import { CharsetType, StatusCodeType } from '../http/types.ts';
import { IRequest } from '../request/types.ts';
import { IResponse } from './types.ts';

/**
 * HttpResponse class implementing IResponse interface.
 * Handles HTTP response creation with various content types and status codes.
 */
export class HttpResponse implements IResponse {
  /** Response data as object or stream */
  private data: Record<string, unknown> | ReadableStream | null = null;
  /** Raw content string */
  private content: string | null = null;
  /** Response message */
  private message: string | null = null;
  /** HTTP status code */
  private status: StatusCodeType = 200;
  /** Response headers */
  public readonly header: Header = new Header();
  /** Response cookies */
  public readonly cookies: ArrayCollection<Cookie> = new ArrayCollection<
    Cookie
  >();

  /**
   * Sets plain text response
   * @param content - Text content
   * @param status - HTTP status code
   * @param charset - Character encoding
   */
  public text(
    content: string,
    status: StatusCodeType = 200,
    charset: CharsetType = 'UTF-8',
  ): this {
    this.content = content;
    this.status = status;
    this.header.delete('Accept');
    this.header.delete('Content-Type');
    this.header.add('Accept', 'text/plain');
    this.header.contentType('text/plain', charset);

    return this;
  }

  /**
   * Sets HTML response
   * @param content - HTML content
   * @param status - HTTP status code
   * @param charset - Character encoding
   */
  public html(
    content: string,
    status: StatusCodeType = 200,
    charset: CharsetType = 'UTF-8',
  ): this {
    this.content = content;
    this.status = status;
    this.header.delete('Accept');
    this.header.delete('Content-Type');
    this.header.add('Accept', 'text/html');
    this.header.contentType('text/html', charset);

    return this;
  }

  /**
   * Sets JSON response
   * @param data - Data to serialize as JSON
   * @param status - HTTP status code
   * @param charset - Character encoding
   */
  public json(
    data: Record<string, unknown>,
    status: StatusCodeType = 200,
    charset: CharsetType = 'UTF-8',
  ): this {
    this.data = data;
    this.status = status;
    this.header.delete('Accept');
    this.header.delete('Content-Type');
    this.header.add('Accept', 'application/json');
    this.header.contentType('application/json', charset);

    return this;
  }

  /**
   * Sets streaming response
   * @param data - String or ReadableStream to stream
   * @param status - HTTP status code
   */
  public stream(
    data: string | ReadableStream,
    status: StatusCodeType = 200,
  ): this {
    this.data = data instanceof ReadableStream ? data : new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(data));
      },
    });
    this.status = status;

    return this;
  }

  /**
   * Sets error response
   * @param message - Error message
   * @param data - Additional error data
   * @param status - HTTP status code
   */
  public exception(
    message: string,
    data: Record<string, unknown> | null = null,
    status: StatusCodeType = 500,
  ): this {
    this.message = message;
    this.data = data;
    this.status = status;
    this.header.delete('Accept');
    this.header.delete('Content-Type');
    this.header.add('Accept', 'application/json');
    this.header.contentType('application/json');

    return this;
  }

  /**
   * Sets 404 not found response
   * @param message - Error message
   * @param data - Additional error data
   * @param status - HTTP status code
   */
  public notFound(
    message: string,
    data: Record<string, unknown> | null = null,
    status: StatusCodeType = 404,
  ): this {
    return this.exception(message, data, status);
  }

  /**
   * Creates redirect response
   * @param url - Redirect target URL
   * @param status - HTTP status code
   */
  public redirect(
    url: string | URL,
    status: StatusCodeType = 307,
  ): Response {
    return Response.redirect(url, status);
  }

  /** Checks if response has successful status code */
  public isSuccessful(): boolean {
    return isSuccessfulStatus(this.status);
  }

  /** Checks if response has informational status code */
  public isInformational(): boolean {
    return isInformationalStatus(this.status);
  }

  /** Checks if response has redirect status code */
  public isRedirect(): boolean {
    return isRedirectStatus(this.status);
  }

  /** Checks if response has client error status code */
  public isClientError(): boolean {
    return isClientErrorStatus(this.status);
  }

  /** Checks if response has server error status code */
  public isServerError(): boolean {
    return isServerErrorStatus(this.status);
  }

  /** Checks if response has error status code */
  public isError(): boolean {
    return isErrorStatus(this.status);
  }

  /** Gets response data object */
  public getData(): Record<string, unknown> {
    return {
      data: this.data,
      message: this.message,
      state: {
        success: this.isSuccessful(),
        status: this.status,
      },
    };
  }

  /**
   * Builds final Response object
   * @param request - Optional request object for auth info
   */
  public build(request?: IRequest): Response {
    for (const cookie of this.cookies) {
      setCookie(this.header.native, cookie);
    }

    const responseOptions = {
      status: this.status,
      statusText: STATUS_TEXT[this.status],
      headers: this.header.native,
    };

    if (this.data instanceof ReadableStream) {
      return new Response(
        this.data.pipeThrough(new TextEncoderStream()),
        responseOptions,
      );
    }

    const auth = request?.auth;
    const isAuthenticated = auth?.isAuthenticated() ?? false;
    const user = auth?.getUser() ?? null;
    const data = {
      ...this.getData(),
      auth: {
        isAuthenticated,
        user: {
          username: user?.getUsername() ?? null,
          roles: user?.getRole().getRoles() ?? [],
          isSuperAdmin: user?.isSuperAdmin() ?? false,
          isAdmin: user?.isAdmin() ?? false,
          isUser: user?.isUser() ?? false,
        },
      },
    };

    return new Response(
      this.header.isJson() ? JSON.stringify(data) : this.content,
      responseOptions,
    );
  }
}
