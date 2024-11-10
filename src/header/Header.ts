import { ReadonlyHeader } from '@/header/ReadonlyHeader.ts';
import { IHeader } from '@/header/types.ts';
import { CharsetType, HeaderFieldType, MimeType } from '@/http/types.ts';

export class Header extends ReadonlyHeader implements IHeader {
  constructor(headers?: Headers) {
    super(headers || new Headers());
  }

  public setCacheControl(value: string): this {
    this.add('Cache-Control', value);

    return this;
  }

  public setEtag(value: string): this {
    this.add('Etag', value);

    return this;
  }

  public setAuthorization(value: string): this {
    this.add('Authorization', value);

    return this;
  }

  public setBasicAuth(token: string): this {
    this.add('Authorization', `Basic ${token}`);

    return this;
  }

  public setBearerToken(token: string): this {
    this.add('Authorization', `Bearer ${token}`);

    return this;
  }

  public setBlobType(charset?: CharsetType): this {
    this.contentType('application/octet-stream', charset);

    return this;
  }

  public setJsonType(charset?: CharsetType): this {
    this.add('Accept', 'application/json');
    this.contentType('application/json', charset);

    return this;
  }

  public setStreamType(charset?: CharsetType): this {
    return this.setBlobType(charset);
  }

  public setFormDataType(charset?: CharsetType): this {
    this.contentType('multipart/form-data', charset);

    return this;
  }

  public setFormType(charset?: CharsetType): this {
    this.contentType('application/x-www-form-urlencoded', charset);

    return this;
  }

  public setHtmlType(charset?: CharsetType): this {
    this.contentType('text/html', charset);

    return this;
  }

  public setTextType(charset?: CharsetType): this {
    this.contentType('text/plain', charset);

    return this;
  }

  public contentType(value: MimeType, charset?: CharsetType): this {
    this.native.append(
      'Content-Type',
      charset ? `${value}; charset=${charset}` : value,
    );

    return this;
  }

  public contentDisposition(value: string): this {
    this.add('Content-Disposition', `${value}`);

    return this;
  }

  public contentLength(length: number): this {
    this.add('Content-Length', `${length}`);

    return this;
  }

  public setCustom(value: string): this {
    this.add('X-Custom', value);

    return this;
  }

  public add(name: HeaderFieldType, value: string): this {
    this.native.append(name, value);

    return this;
  }

  public delete(name: HeaderFieldType): this {
    this.native.delete(name);

    return this;
  }

  public set(name: HeaderFieldType, value: string): this {
    this.native.set(name, value);

    return this;
  }
}
