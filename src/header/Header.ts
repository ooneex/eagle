import { CharsetType, HeaderFieldType, MimeType } from '../http/types.ts';
import { ReadonlyHeader } from './ReadonlyHeader.ts';
import { IHeader } from './types.ts';

/**
 * Header class extending ReadonlyHeader for managing HTTP headers
 */
export class Header extends ReadonlyHeader implements IHeader {
  /**
   * Creates new Header instance
   * @param headers Optional Headers object to initialize with
   */
  constructor(headers?: Headers) {
    super(headers || new Headers());
  }

  /**
   * Sets Cache-Control header
   * @param value Cache control value
   */
  public setCacheControl(value: string): this {
    this.add('Cache-Control', value);

    return this;
  }

  /**
   * Sets ETag header
   * @param value ETag value
   */
  public setEtag(value: string): this {
    this.add('Etag', value);

    return this;
  }

  /**
   * Sets Authorization header
   * @param value Authorization value
   */
  public setAuthorization(value: string): this {
    this.add('Authorization', value);

    return this;
  }

  /**
   * Sets Basic authentication
   * @param token Basic auth token
   */
  public setBasicAuth(token: string): this {
    this.add('Authorization', `Basic ${token}`);

    return this;
  }

  /**
   * Sets Bearer token authentication
   * @param token Bearer token
   */
  public setBearerToken(token: string): this {
    this.add('Authorization', `Bearer ${token}`);

    return this;
  }

  /**
   * Sets content type to binary blob
   * @param charset Optional character set
   */
  public setBlobType(charset?: CharsetType): this {
    this.contentType('application/octet-stream', charset);

    return this;
  }

  /**
   * Sets content type to JSON
   * @param charset Optional character set
   */
  public setJsonType(charset?: CharsetType): this {
    this.add('Accept', 'application/json');
    this.contentType('application/json', charset);

    return this;
  }

  /**
   * Sets content type to binary stream
   * @param charset Optional character set
   */
  public setStreamType(charset?: CharsetType): this {
    return this.setBlobType(charset);
  }

  /**
   * Sets content type to multipart form data
   * @param charset Optional character set
   */
  public setFormDataType(charset?: CharsetType): this {
    this.contentType('multipart/form-data', charset);

    return this;
  }

  /**
   * Sets content type to URL encoded form
   * @param charset Optional character set
   */
  public setFormType(charset?: CharsetType): this {
    this.contentType('application/x-www-form-urlencoded', charset);

    return this;
  }

  /**
   * Sets content type to HTML
   * @param charset Optional character set
   */
  public setHtmlType(charset?: CharsetType): this {
    this.contentType('text/html', charset);

    return this;
  }

  /**
   * Sets content type to plain text
   * @param charset Optional character set
   */
  public setTextType(charset?: CharsetType): this {
    this.contentType('text/plain', charset);

    return this;
  }

  /**
   * Sets Content-Type header with optional charset
   * @param value MIME type
   * @param charset Character set (defaults to UTF-8)
   */
  public contentType(value: MimeType, charset: CharsetType = 'UTF-8'): this {
    this.native.append(
      'Content-Type',
      charset ? `${value}; charset=${charset}` : value,
    );

    return this;
  }

  /**
   * Sets Content-Disposition header
   * @param value Content disposition value
   */
  public contentDisposition(value: string): this {
    this.add('Content-Disposition', `${value}`);

    return this;
  }

  /**
   * Sets Content-Length header
   * @param length Content length in bytes
   */
  public contentLength(length: number): this {
    this.add('Content-Length', `${length}`);

    return this;
  }

  /**
   * Sets custom X-Custom header
   * @param value Custom header value
   */
  public setCustom(value: string): this {
    this.add('X-Custom', value);

    return this;
  }

  /**
   * Appends a header field
   * @param name Header field name
   * @param value Header field value
   */
  public add(name: HeaderFieldType, value: string): this {
    this.native.append(name, value);

    return this;
  }

  /**
   * Deletes a header field
   * @param name Header field name
   */
  public delete(name: HeaderFieldType): this {
    this.native.delete(name);

    return this;
  }

  /**
   * Sets a header field, replacing any existing values
   * @param name Header field name
   * @param value Header field value
   */
  public set(name: HeaderFieldType, value: string): this {
    this.native.set(name, value);

    return this;
  }
}
