import { Header } from '@/header/Header.ts';
import { STATUS_CODE_TEXT } from '@/http/http_status.ts';
import { CharsetType, StatusCodeType } from '@/http/types.ts';
import { IHttpResponse } from '@/response/types.ts';

export class HttpResponse implements IHttpResponse {
  private data: Record<string, unknown> | ReadableStream | null = null;
  private content: string | null = null;
  private message: string | null = null;
  private status: StatusCodeType = 200;
  public readonly header: Header = new Header();

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

  public redirect(
    url: string | URL,
    status: StatusCodeType = 307,
  ): Response {
    return Response.redirect(url, status);
  }

  public build(): Response {
    const responseOptions = {
      status: this.status,
      statusText: STATUS_CODE_TEXT[this.status],
      headers: this.header.native,
    };

    if (this.data instanceof ReadableStream) {
      return new Response(
        this.data.pipeThrough(new TextEncoderStream()),
        responseOptions,
      );
    }

    const resp = {
      data: this.data,
      message: this.message,
      state: {
        success: this.status >= 200 && this.status < 300,
        status: this.status,
      },
    };

    return new Response(
      this.header.isJson() ? JSON.stringify(resp) : this.content,
      responseOptions,
    );
  }
}
