import { HeaderChecker } from '@/header/HeaderChecker.ts';
import { IReadonlyHeader, IUserAgent } from '@/header/types.ts';
import {
  CharsetType,
  EncodingType,
  HeaderFieldType,
  MethodType,
  MimeType,
} from '@/http/types.ts';
import { UserAgent } from '@std/http/user-agent';

type MimeReturnType = MimeType | '*/*' | null;

export class ReadonlyHeader extends HeaderChecker implements IReadonlyHeader {
  constructor(public readonly native: Headers) {
    super(native);
  }

  public getCharset(): CharsetType | null {
    const contentType = this.getContentType();

    if (!contentType) {
      return null;
    }

    const match = contentType.match(/charset *= *(?<charset>[a-z0-9-]+)/i);

    if (!match) {
      return null;
    }

    return match[1].toUpperCase() as CharsetType | null;
  }

  public get(name: HeaderFieldType): string | null {
    return this.native.get(name);
  }

  public getCacheControl(): string | null {
    return this.get('Cache-Control');
  }

  public getEtag(): string | null {
    return this.get('Etag');
  }

  public getAccept(): MimeReturnType {
    return this.get('Accept') as MimeReturnType;
  }

  public getAcceptEncoding(): EncodingType[] | null {
    const encoding = this.get('Accept-Encoding');

    if (!encoding) {
      return null;
    }

    return encoding.split(',').map((val) => {
      return val.trim();
    }) as EncodingType[] | null;
  }

  public getAllow(): MethodType | null {
    return this.get('Allow') as MethodType | null;
  }

  public getContentLength(): number | null {
    const length = this.get('Content-Length');

    if (!length) {
      return null;
    }

    return Number.parseInt(length);
  }

  public getContentType(): MimeReturnType {
    return this.get('Content-Type') as MimeType | '*/*' | null;
  }

  public getContentDisposition(): string | null {
    return this.get('Content-Disposition');
  }

  public getCustom(): string | null {
    return this.get('X-Custom');
  }

  public getCookie(): string | null {
    return this.get('Cookie');
  }

  public getHost(): string | null {
    return this.get('Host');
  }

  public getReferer(): string | null {
    return this.get('Referer');
  }

  public getRefererPolicy(): string | null {
    return this.get('Referrer-Policy');
  }

  public getServer(): string | null {
    return this.get('Server');
  }

  public getUserAgent(): IUserAgent {
    return new UserAgent(this.get('User-Agent'));
  }

  public getAuthorization(): string | null {
    return this.get('Authorization');
  }

  public getBasicAuth(): string | null {
    const auth = this.get('Authorization');

    if (!auth) {
      return null;
    }

    const match = auth.match(/Basic +(?<auth>[^, ]+)/);

    if (!match) {
      return null;
    }

    return match[1];
  }

  public getBearerToken(): string | null {
    const token = this.get('Authorization');

    if (!token) {
      return null;
    }

    const match = token.match(/Bearer +(?<token>[^, ]+)/);

    if (!match) {
      return null;
    }

    return match[1];
  }

  public has(name: HeaderFieldType): boolean {
    return this.native.has(name);
  }

  public keys(): HeaderFieldType[] {
    const keys: HeaderFieldType[] = [];

    for (const [key] of this) {
      keys.push(key as HeaderFieldType);
    }

    return keys;
  }

  public count(): number {
    return this.keys().length;
  }

  public hasData(): boolean {
    return 0 < this.count();
  }

  public toJson(): Record<string, string> {
    const headers: Record<string, string> = {};

    for (const [key, value] of this) {
      headers[key] = value;
    }

    return headers;
  }

  // deno-lint-ignore no-explicit-any
  [Symbol.iterator](): IterableIterator<[HeaderFieldType, any]> {
    // @ts-ignore: trust me
    return this.native[Symbol.iterator]();
  }
}
