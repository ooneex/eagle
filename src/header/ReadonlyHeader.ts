import type {
  CharsetType,
  EncodingType,
  HeaderFieldType,
  MethodType,
  MimeType,
} from '@/http/types.ts';
import { UAParser } from 'ua-parser-js';
import { HeaderChecker } from './HeaderChecker.ts';
import type { IReadonlyHeader, IUserAgent } from './types.ts';

/**
 * Type representing possible MIME type return values
 */
type MimeReturnType = MimeType | '*/*' | null;

/**
 * Class providing read-only access to HTTP headers with helper methods for common header fields
 */
export class ReadonlyHeader extends HeaderChecker implements IReadonlyHeader {
  /**
   * Creates a new ReadonlyHeader instance
   * @param native The underlying Headers object
   */
  constructor(public readonly native: Headers) {
    super(native);
  }

  /**
   * Gets the charset from the Content-Type header
   * @returns The charset or null if not specified
   */
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

  /**
   * Gets a header value by name
   * @param name The header field name
   * @returns The header value or null if not present
   */
  public get(name: HeaderFieldType): string | null {
    return this.native.get(name);
  }

  /**
   * Gets the Cache-Control header
   */
  public getCacheControl(): string | null {
    return this.get('Cache-Control');
  }

  /**
   * Gets the ETag header
   */
  public getEtag(): string | null {
    return this.get('Etag');
  }

  /**
   * Gets the Accept header
   */
  public getAccept(): MimeReturnType {
    return this.get('Accept') as MimeReturnType;
  }

  /**
   * Gets the Accept-Encoding header as an array of encoding types
   */
  public getAcceptEncoding(): EncodingType[] | null {
    const encoding = this.get('Accept-Encoding');

    if (!encoding) {
      return null;
    }

    return encoding.split(',').map((val) => {
      return val.trim();
    }) as EncodingType[] | null;
  }

  /**
   * Gets the Allow header
   */
  public getAllow(): MethodType[] | null {
    const allow = this.get('Allow');
    if (!allow) {
      return null;
    }

    return allow.split(',').map((method) => method.trim()) as MethodType[];
  }

  /**
   * Gets the Content-Length header as a number
   */
  public getContentLength(): number | null {
    const length = this.get('Content-Length');

    if (!length) {
      return null;
    }

    return Number.parseInt(length);
  }

  /**
   * Gets the Content-Type header
   */
  public getContentType(): MimeReturnType {
    return this.get('Content-Type') as MimeReturnType;
  }

  /**
   * Gets the Content-Disposition header
   */
  public getContentDisposition(): string | null {
    return this.get('Content-Disposition');
  }

  /**
   * Gets a custom header (X-Custom)
   */
  public getCustom(): string | null {
    return this.get('X-Custom');
  }

  /**
   * Gets the Cookie header
   */
  public getCookie(): string | null {
    return this.get('Cookie');
  }

  /**
   * Gets the Host header
   */
  public getHost(): string | null {
    return this.get('Host');
  }

  /**
   * Gets the client IP from X-Forwarded-For or Remote-Addr headers
   */
  public getIp(): string | null {
    return this.get('X-Forwarded-For') || this.get('Remote-Addr');
  }

  /**
   * Gets the Referer header
   */
  public getReferer(): string | null {
    return this.get('Referer');
  }

  /**
   * Gets the Referrer-Policy header
   */
  public getRefererPolicy(): string | null {
    return this.get('Referrer-Policy');
  }

  /**
   * Gets the Server header
   */
  public getServer(): string | null {
    return this.get('Server');
  }

  /**
   * Gets the User-Agent header as a parsed UserAgent object
   */
  public getUserAgent(): IUserAgent {
    return UAParser(this.get('User-Agent') as string);
  }

  /**
   * Gets the Authorization header
   */
  public getAuthorization(): string | null {
    return this.get('Authorization');
  }

  /**
   * Extracts the Basic auth token from the Authorization header
   */
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

  /**
   * Extracts the Bearer token from the Authorization header
   */
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

  /**
   * Checks if a header exists
   * @param name The header field name
   */
  public has(name: HeaderFieldType): boolean {
    return this.native.has(name);
  }

  /**
   * Gets all header field names
   */
  public keys(): HeaderFieldType[] {
    const keys: HeaderFieldType[] = [];

    for (const [key] of this) {
      keys.push(key as HeaderFieldType);
    }

    return keys;
  }

  /**
   * Gets the number of headers
   */
  public count(): number {
    return this.keys().length;
  }

  /**
   * Checks if there are any headers
   */
  public hasData(): boolean {
    return 0 < this.count();
  }

  /**
   * Converts headers to a plain object
   */
  public toJson(): Record<string, string> {
    const headers: Record<string, string> = {};

    for (const [key, value] of this) {
      headers[key] = value;
    }

    return headers;
  }

  // biome-ignore lint/suspicious/noExplicitAny: trust me
  [Symbol.iterator](): IterableIterator<[HeaderFieldType, any]> {
    // @ts-ignore: trust me
    return this.native[Symbol.iterator]();
  }
}
