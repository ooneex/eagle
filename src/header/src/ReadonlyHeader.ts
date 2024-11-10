import type {
  CharsetType,
  EncodingType,
  HeaderFieldType,
  MethodType,
  MimeType,
} from "@ooneex/http";
import { HeaderChecker } from "./HeaderChecker";
import { UserAgent } from "./UserAgent";
import type { IReadonlyHeader, IUserAgent } from "./types";

type MimeReturnType = MimeType | "*/*" | null;

/**
 * Represents a readonly HTTP header object.
 */
export class ReadonlyHeader extends HeaderChecker implements IReadonlyHeader {
  /**
   * Creates an instance of the HeadersWrapper class.
   */
  constructor(public readonly native: Headers) {
    super(native);
  }

  /**
   * Retrieves the character set from the Content-Type header.
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
   * Retrieves the value associated with the provided header field type.
   */
  public get(name: HeaderFieldType): string | null {
    return this.native.get(name);
  }

  /**
   * Retrieves the value of the "Cache-Control" header from the current response.
   */
  public getCacheControl(): string | null {
    return this.get("Cache-Control");
  }

  /**
   * Retrieves the Etag value from the request headers.
   */
  public getEtag(): string | null {
    return this.get("Etag");
  }

  /**
   * Retrieves the value of the "Accept" header from the current request.
   */
  public getAccept(): MimeReturnType {
    return this.get("Accept") as MimeReturnType;
  }

  /**
   * Retrieves the Accept-Encoding header value from the request.
   */
  public getAcceptEncoding(): EncodingType[] | null {
    const encoding = this.get("Accept-Encoding");

    if (!encoding) {
      return null;
    }

    return encoding.split(",").map((val) => {
      return val.trim();
    }) as EncodingType[] | null;
  }

  /**
   * Returns the value of the 'Allow' method, if it exists.
   */
  public getAllow(): MethodType | null {
    return this.get("Allow") as MethodType | null;
  }

  /**
   * Retrieves the content length of the HTTP response.
   */
  public getContentLength(): number | null {
    const length = this.get("Content-Length");

    if (!length) {
      return null;
    }

    return Number.parseInt(length);
  }

  /**
   * Retrieves the content type of the response.
   */
  public getContentType(): MimeReturnType {
    return this.get("Content-Type") as MimeType | "*/*" | null;
  }

  /**
   * Retrieves the value of the Content-Disposition header from the current HTTP response.
   */
  public getContentDisposition(): string | null {
    return this.get("Content-Disposition");
  }

  /**
   * Retrieves the value of the X-Custom header from the current instance.
   */
  public getCustom(): string | null {
    return this.get("X-Custom");
  }

  /**
   * Retrieves the value of a cookie with the name "Cookie".
   */
  public getCookie(): string | null {
    return this.get("Cookie");
  }

  /**
   * Retrieves the value of the "Host" property from the current instance.
   */
  public getHost(): string | null {
    return this.get("Host");
  }

  /**
   * Retrieves the 'Referer' header value from the current request.
   */
  public getReferer(): string | null {
    return this.get("Referer");
  }

  /**
   * Retrieves the value of the "Referrer-Policy" header from the current object.
   */
  public getRefererPolicy(): string | null {
    return this.get("Referrer-Policy");
  }

  /**
   * Retrieves the value of the "Server" parameter from the current instance.
   */
  public getServer(): string | null {
    return this.get("Server");
  }

  /**
   * Retrieves the user agent string from the current request.
   */
  public getUserAgent(): IUserAgent {
    return new UserAgent(this.get("User-Agent"));
  }

  /**
   * Retrieves the Authorization value from the current object.
   */
  public getAuthorization(): string | null {
    return this.get("Authorization");
  }

  /**
   * Retrieves the basic authentication token from the `Authorization` header.
   */
  public getBasicAuth(): string | null {
    const auth = this.get("Authorization");

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
   * Retrieves the bearer token from the Authorization header.
   */
  public getBearerToken(): string | null {
    const token = this.get("Authorization");

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
   * Checks if the given header field type exists in the native object.
   */
  public has(name: HeaderFieldType): boolean {
    return this.native.has(name);
  }

  /**
   * Retrieves an array of keys from the native object.
   */
  public keys(): HeaderFieldType[] {
    const keys: HeaderFieldType[] = [];

    for (const [key] of this) {
      keys.push(key as HeaderFieldType);
    }

    return keys;
  }

  /**
   * Returns the number of elements in the object.
   */
  public count(): number {
    return this.keys().length;
  }

  /**
   * Checks if the instance contains data.
   */
  public hasData(): boolean {
    return 0 < this.count();
  }

  /**
   * Converts the native headers object to a JSON representation.
   */
  public toJson(): Record<string, string> {
    const headers: Record<string, string> = {};

    for (const [key, value] of this) {
      headers[key] = value;
    }

    return headers;
  }

  /**
   * Returns an iterator object that can be used to iterate over the entries of the object.
   */
  [Symbol.iterator](): IterableIterator<[HeaderFieldType, any]> {
    // @ts-ignore: trust me
    return this.native[Symbol.iterator]();
  }
}
