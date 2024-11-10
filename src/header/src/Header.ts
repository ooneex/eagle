import type { CharsetType, HeaderFieldType, MimeType } from "@ooneex/http";
import { ReadonlyHeader } from "./ReadonlyHeader";
import type { IHeader } from "./types";

/**
 * Represents the header of an HTTP request or response.
 */
export class Header extends ReadonlyHeader implements IHeader {
  /**
   * Constructor for creating an instance of the class.
   */
  constructor(headers?: Headers) {
    super(headers || new Headers());
  }

  /**
   * Sets the cache control value for the HTTP response header.
   */
  public setCacheControl(value: string): this {
    this.add("Cache-Control", value);

    return this;
  }

  /**
   * Sets the Etag value.
   */
  public setEtag(value: string): this {
    this.add("Etag", value);

    return this;
  }

  /**
   * Sets the value of the "Authorization" header.
   */
  public setAuthorization(value: string): this {
    this.add("Authorization", value);

    return this;
  }

  /**
   * Sets the Basic Authentication token for the request.
   */
  public setBasicAuth(token: string): this {
    this.add("Authorization", `Basic ${token}`);

    return this;
  }

  /**
   * Sets the Bearer token for the request.
   */
  public setBearerToken(token: string): this {
    this.add("Authorization", `Bearer ${token}`);

    return this;
  }

  /**
   * Set the blob type for the current request.
   */
  public setBlobType(charset?: CharsetType): this {
    this.contentType("application/octet-stream", charset);

    return this;
  }

  /**
   * Sets the JSON type for the request.
   */
  public setJsonType(charset?: CharsetType): this {
    this.add("Accept", "application/json");
    this.contentType("application/json", charset);
    this.contentType("application/ld+json", charset);

    return this;
  }

  /**
   * Sets the stream type for the request.
   */
  public setStreamType(charset?: CharsetType): this {
    return this.setBlobType(charset);
  }

  /**
   * Sets the data type for a form submission request.
   */
  public setFormDataType(charset?: CharsetType): this {
    this.contentType("multipart/form-data", charset);

    return this;
  }

  /**
   * Sets the form type for the request.
   */
  public setFormType(charset?: CharsetType): this {
    this.contentType("application/x-www-form-urlencoded", charset);

    return this;
  }

  /**
   * Sets the HTML type for the response.
   */
  public setHtmlType(charset?: CharsetType): this {
    this.contentType("text/html", charset);

    return this;
  }

  /**
   * Sets the text type for the current instance.
   */
  public setTextType(charset?: CharsetType): this {
    this.contentType("text/plain", charset);

    return this;
  }

  /**
   * Sets the content type of the request.
   */
  public contentType(value: MimeType, charset?: CharsetType): this {
    this.native.append(
      "Content-Type",
      charset ? `${value}; charset=${charset}` : value,
    );

    return this;
  }

  /**
   * Sets the Content-Disposition header value for the current HTTP request.
   */
  public contentDisposition(value: string): this {
    this.add("Content-Disposition", `${value}`);

    return this;
  }

  /**
   * Sets the Content-Length header value.
   */
  public contentLength(length: number): this {
    this.add("Content-Length", `${length}`);

    return this;
  }

  /**
   * Sets a custom header value for the HTTP request.
   */
  public setCustom(value: string): this {
    this.add("X-Custom", value);

    return this;
  }

  /**
   * Adds a header field to the native object.
   */
  public add(name: HeaderFieldType, value: string): this {
    this.native.append(name, value);

    return this;
  }

  /**
   * Deletes a header field.
   */
  public delete(name: HeaderFieldType): this {
    this.native.delete(name);

    return this;
  }

  /**
   * Sets the value of the specified header field.
   */
  public set(name: HeaderFieldType, value: string): this {
    this.native.set(name, value);

    return this;
  }
}
