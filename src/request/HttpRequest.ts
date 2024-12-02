import { Cookie, getSetCookies } from 'jsr:@std/http/cookie';
import parser from 'npm:accept-language-parser';
import { ReadonlyCollection } from '../collection/ReadonlyCollection.ts';
import { IReadonlyCollection } from '../collection/types.ts';
import { ReadonlyHeader } from '../header/ReadonlyHeader.ts';
import { IReadonlyHeader, IUserAgent } from '../header/types.ts';
import { parseString } from '../helper/parseString.ts';
import { Jwt } from '../jwt/Jwt.ts';
import { Auth } from '../security/Auth.ts';
import { IAuth } from '../security/types.ts';
import { ScalarType } from '../types.ts';
import { IUrl } from '../url/types.ts';
import { Url } from '../url/Url.ts';
import { RequestFile } from './RequestFile.ts';
import {
  IRequest,
  IRequestFile,
  LanguageType,
  RequestMethodType,
} from './types.ts';

/**
 * Represents an HTTP request with various properties and methods for handling web requests.
 * Implements the IRequest interface and provides access to request data like URL, headers,
 * cookies, files, and authentication information.
 */
export class HttpRequest implements IRequest {
  /** The URL object representing the request URL */
  public readonly url: IUrl;
  /** The path portion of the URL */
  public readonly path: string;
  /** The HTTP method of the request */
  public readonly method: RequestMethodType;
  /** The request headers */
  public readonly header: IReadonlyHeader;
  /** Information about the user agent making the request */
  public readonly userAgent: IUserAgent;
  /** Collection of URL query parameters */
  public readonly queries: IReadonlyCollection<string, ScalarType>;
  /** Collection of route parameters */
  public readonly params: IReadonlyCollection<string, ScalarType>;
  /** Collection of request body payload data */
  public readonly payload: IReadonlyCollection<string, unknown>;
  /** The IP address of the client */
  public readonly ip: string | null;
  /** The host header value */
  public readonly host: string | null;
  /** The referer header value */
  public readonly referer: string | null;
  /** The server header value */
  public readonly server: string | null;
  /** The bearer token from the Authorization header */
  public readonly bearerToken: string | null;
  /** Collection of request cookies */
  public readonly cookies: IReadonlyCollection<string, Cookie>;
  /** Collection of uploaded files */
  public readonly files: IReadonlyCollection<string, IRequestFile>;
  /** Collection of form data values */
  public readonly form: IReadonlyCollection<string, unknown>;
  /** The parsed JWT if a bearer token is present */
  public readonly jwt: Jwt | null = null;
  /** Authentication information if a bearer token is present */
  public readonly auth: IAuth | null = null;
  /** The detected language preference from Accept-Language header */
  public readonly lang: LanguageType | null = null;

  /**
   * Creates a new HttpRequest instance
   * @param native The underlying Request object
   * @param config Optional configuration object containing params, payload and formData
   */
  constructor(
    private readonly native: Readonly<Request>,
    config?: {
      params?: Record<string, ScalarType>;
      payload?: Record<string, unknown>;
      formData?: FormData | null;
    },
  ) {
    this.url = new Url(this.native.url);
    this.path = this.url.path;
    this.method = this.native.method.toUpperCase() as RequestMethodType;
    this.header = new ReadonlyHeader(native.headers);
    this.userAgent = this.header.getUserAgent();
    this.queries = this.url.queries;
    const params: [string, ScalarType][] = [];
    for (const [key, value] of Object.entries(config?.params ?? {})) {
      params.push([key, parseString(`${value}`)]);
    }
    this.params = new ReadonlyCollection(params);

    const payload: [string, unknown][] = [];
    for (const [key, value] of Object.entries(config?.payload ?? {})) {
      payload.push([key, value]);
    }
    this.payload = new ReadonlyCollection(payload);

    this.ip = this.header.getIp();
    this.host = this.header.getHost();
    this.referer = this.header.getReferer();
    this.server = this.header.getServer();
    this.bearerToken = this.header.getBearerToken();

    if (this.bearerToken) {
      this.jwt = new Jwt(this.bearerToken);
      this.auth = new Auth();
      this.auth.login(this.jwt);
    }

    const cookies = getSetCookies(this.native.headers);
    const cookiesArray: [string, Cookie][] = [];
    for (const cookie of cookies) {
      cookie.value = parseString(`${cookie.value}`);
      cookiesArray.push([cookie.name, cookie]);
    }
    this.cookies = new ReadonlyCollection(cookiesArray);

    const filesArray: [string, IRequestFile][] = [];
    if (config?.formData) {
      for (const [key, value] of config.formData.entries()) {
        if (value instanceof File) {
          filesArray.push([key, new RequestFile(value)]);
        }
      }
    }
    this.files = new ReadonlyCollection(filesArray);

    const formArray: [string, unknown][] = [];
    for (const [key, value] of config?.formData?.entries() ?? []) {
      if (!(value instanceof File)) {
        formArray.push([key, parseString(`${value}`)]);
      }
    }
    this.form = new ReadonlyCollection(formArray);

    const languages = parser.parse(this.header.get('Accept-Language'));
    const language = languages[0];
    if (language) {
      this.lang = {
        code: language.code,
        region: language.region ?? null,
      };
    }
  }

  /**
   * Checks if the request is an XMLHttpRequest (AJAX request)
   * @returns true if the request is an XMLHttpRequest, false otherwise
   */
  public isXMLHttpRequest(): boolean {
    return this.header.get('X-Requested-With') === 'XMLHttpRequest';
  }
}
