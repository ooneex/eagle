import { Header } from "@ooneex/header";
import type { CharsetType, StatusCodeType } from "@ooneex/http";
import type { ScalarType } from "@ooneex/types";
import type { BunFile } from "bun";
import { NotFoundResponse } from "./NotFoundResponse";
import { RedirectResponse } from "./RedirectResponse";
import type { IResponse } from "./types";

/**
 * Class representing an HTTP response.
 */
export class HttpResponse implements IResponse {
  public readonly data: Record<string, unknown>;
  public readonly header: Header = new Header();
  public status: StatusCodeType | null = null;

  constructor(data?: Record<string, unknown>) {
    this.data = data ?? {};
  }

  /**
   * Sets the response content as plain text.
   */
  public text(
    content: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ): string | Promise<string> {
    this.status = status ?? null;
    this.header.contentType("text/plain", charset);

    return content;
  }

  /**
   * Sets the content and status code for an HTML response.
   */
  public html(
    content: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ): string | Promise<string> {
    this.status = status ?? null;
    this.header.contentType("text/html", charset);

    return content;
  }

  /**
   * Sets the content and status code for a JavaScript response.
   */
  public js(
    content: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ): string | Promise<string> {
    this.status = status ?? null;
    this.header.contentType("application/javascript", charset);

    return content;
  }

  /**
   * Creates a file response with the specified path and status.
   */
  public file(
    path: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ): BunFile | Promise<BunFile> {
    this.status = status ?? null;
    this.header.contentType("application/octet-stream", charset);

    return Bun.file(path);
  }

  /**
   * Sets the response data as JSON format and returns a response object.
   */
  public json<T = Record<string, ScalarType>>(
    data: T,
    status?: StatusCodeType,
    charset?: CharsetType,
  ): T | Promise<T> {
    this.status = status ?? null;
    this.header.contentType("application/json", charset);

    return data;
  }

  /**
   * Method to handle not found responses.
   */
  public notFound(
    message: string,
    data?: Record<string, ScalarType>,
    status?: StatusCodeType,
  ): NotFoundResponse | Promise<NotFoundResponse> {
    return new NotFoundResponse(message, data, status);
  }

  /**
   * Redirects to the specified URL with the given status code.
   */
  public redirect(
    url: string | URL,
    status?: StatusCodeType,
  ): RedirectResponse | Promise<RedirectResponse> {
    return new RedirectResponse(url, status);
  }
}
