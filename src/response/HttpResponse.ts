import { ArrayCollection } from '../collection/ArrayCollection';
import { Header } from '../header/Header';
import { type Cookie as CookieType, setCookie } from '../http/cookie';
import {
  STATUS_TEXT,
  isClientErrorStatus,
  isErrorStatus,
  isInformationalStatus,
  isRedirectStatus,
  isServerErrorStatus,
  isSuccessfulStatus,
} from '../http/status';
import type { CharsetType, StatusCodeType } from '../http/types';
import type { IRequest } from '../request/types';
import { ERole, type IUser } from '../security/types';
import type { IResponse } from './types';

export class HttpResponse implements IResponse {
  private data: Record<string, unknown> | ReadableStream | null = null;
  private message: string | null = null;
  private status: StatusCodeType = 200;
  public readonly header: Header = new Header();
  public readonly cookies: ArrayCollection<CookieType> =
    new ArrayCollection<CookieType>();

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

  public stream(
    data: string | ReadableStream,
    status: StatusCodeType = 200,
  ): this {
    this.data =
      data instanceof ReadableStream
        ? data
        : new ReadableStream({
            start(controller) {
              controller.enqueue(new TextEncoder().encode(data));
            },
          });
    this.status = status;

    return this;
  }

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

  public notFound(
    message: string,
    data: Record<string, unknown> | null = null,
    status: StatusCodeType = 404,
  ): this {
    return this.exception(message, data, status);
  }

  public redirect(url: string | URL, status: StatusCodeType = 307): Response {
    return Response.redirect(url, status);
  }

  public isSuccessful(): boolean {
    return isSuccessfulStatus(this.status);
  }

  public isInformational(): boolean {
    return isInformationalStatus(this.status);
  }

  public isRedirect(): boolean {
    return isRedirectStatus(this.status);
  }

  public isClientError(): boolean {
    return isClientErrorStatus(this.status);
  }

  public isServerError(): boolean {
    return isServerErrorStatus(this.status);
  }

  public isError(): boolean {
    return isErrorStatus(this.status);
  }

  public getData(): Record<string, unknown> | ReadableStream | null {
    return this.data;
  }

  public build(
    request?: IRequest,
    cxt?: { user?: IUser; isAuthenticated?: boolean },
  ): Response {
    for (const cookie of this.cookies) {
      setCookie(this.header.native, cookie);
    }

    const responseOptions = {
      status: this.status,
      statusText: STATUS_TEXT[this.status],
      headers: this.header.native,
    };

    if (this.data instanceof ReadableStream) {
      return new Response(this.data, responseOptions);
    }

    const data = {
      data: this.data,
      message: this.message,
      state: {
        success: this.isSuccessful(),
        status: this.status,
      },
      method: request?.method,
      path: request?.path,
      lang: request?.lang,
      user: {
        ...cxt?.user,
        id: cxt?.user?.getId() ?? null,
        username: cxt?.user?.getUsername() ?? null,
        roles: cxt?.user?.getRole().get() ?? [ERole.GUEST],
        isMaster: cxt?.user?.isMaster() ?? false,
        isAdmin: cxt?.user?.isAdmin() ?? false,
        isUser: cxt?.user?.isUser() ?? false,
        isGuest: cxt?.user?.isGuest() ?? true,
      },
      isAuthenticated: cxt?.isAuthenticated ?? false,
    };

    return new Response(JSON.stringify(data), responseOptions);
  }
}
