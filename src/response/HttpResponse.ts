import { Header } from '@/header/Header.ts';
import { CharsetType, StatusTextType } from '@/http/types.ts';
import { IResponse } from '@/response/types.ts';
import {
  isClientErrorStatus,
  isErrorStatus,
  isInformationalStatus,
  isRedirectStatus,
  isServerErrorStatus,
  isSuccessfulStatus,
  STATUS_TEXT,
} from '@std/http/status';

export class HttpResponse implements IResponse {
  private data: Record<string, unknown> | ReadableStream | null = null;
  private content: string | null = null;
  private message: string | null = null;
  private status: StatusTextType = 200;
  public readonly header: Header = new Header();

  public text(
    content: string,
    status: StatusTextType = 200,
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

  public html(
    content: string,
    status: StatusTextType = 200,
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

  public json(
    data: Record<string, unknown>,
    status: StatusTextType = 200,
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
    status: StatusTextType = 200,
  ): this {
    this.data = data instanceof ReadableStream ? data : new ReadableStream({
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
    status: StatusTextType = 500,
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
    status: StatusTextType = 404,
  ): this {
    return this.exception(message, data, status);
  }

  public redirect(
    url: string | URL,
    status: StatusTextType = 307,
  ): Response {
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

  public build(): Response {
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

    const data = this.getData();

    return new Response(
      this.header.isJson() ? JSON.stringify(data) : this.content,
      responseOptions,
    );
  }
}
