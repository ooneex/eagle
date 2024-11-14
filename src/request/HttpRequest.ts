import { ReadonlyCollection } from '@/collection/ReadonlyCollection.ts';
import { IReadonlyCollection } from '@/collection/types.ts';
import { ReadonlyHeader } from '@/header/ReadonlyHeader.ts';
import { IReadonlyHeader, IUserAgent } from '@/header/types.ts';
import { parseString } from '@/helper/parseString.ts';
import { IRequest, RequestMethodType } from '@/request/types.ts';
import { ScalarType } from '@/types.ts';
import { IUrl } from '@/url/types.ts';
import { Url } from '@/url/Url.ts';
import { Cookie, getSetCookies } from '@std/http/cookie';

export class HttpRequest implements IRequest {
  public readonly url: IUrl;
  public readonly path: string;
  public readonly method: RequestMethodType;
  public readonly header: IReadonlyHeader;
  public readonly userAgent: IUserAgent;
  public readonly queries: IReadonlyCollection<string, ScalarType>;
  public readonly params: IReadonlyCollection<string, ScalarType>;
  public readonly payload: IReadonlyCollection<string, unknown>;
  public readonly ip: string | null;
  public readonly host: string | null;
  public readonly referer: string | null;
  public readonly server: string | null;
  public readonly bearerToken: string | null;
  public readonly cookies: IReadonlyCollection<string, Cookie>;

  constructor(
    private readonly native: Readonly<Request>,
    config?: {
      params?: Record<string, ScalarType>;
      payload?: Record<string, unknown>;
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

    const cookies = getSetCookies(this.native.headers);
    const cookiesArray: [string, Cookie][] = [];
    for (const cookie of cookies) {
      cookie.value = parseString(`${cookie.value}`);
      cookiesArray.push([cookie.name, cookie]);
    }
    this.cookies = new ReadonlyCollection(cookiesArray);
  }

  public isXMLHttpRequest(): boolean {
    return this.header.get('X-Requested-With') === 'XMLHttpRequest';
  }
}
