import { ReadonlyCollection } from '@/collection/ReadonlyCollection.ts';
import { IReadonlyCollection } from '@/collection/types.ts';
import { ReadonlyHeader } from '@/header/ReadonlyHeader.ts';
import { IReadonlyHeader, IUserAgent } from '@/header/types.ts';
import { RequestMethodType } from '@/request/types.ts';
import { ScalarType } from '@/types.ts';
import { IUrl } from '@/url/types.ts';
import { Url } from '@/url/Url.ts';

export class HttpRequest {
  public readonly url: IUrl;
  public readonly method: RequestMethodType;
  public readonly header: IReadonlyHeader;
  public readonly userAgent: IUserAgent;
  public readonly params: IReadonlyCollection<string, ScalarType>;
  public readonly payload: IReadonlyCollection<string, unknown>;
  public readonly ip: string | null;
  public readonly host: string | null;
  public readonly referer: string | null;
  public readonly server: string | null;
  public readonly bearerToken: string | null;

  constructor(
    private readonly request: Readonly<Request>,
    config?: {
      params?: Record<string, ScalarType>;
      payload?: Record<string, unknown>;
    },
  ) {
    this.url = new Url(this.request.url);
    this.method = this.request.method.toUpperCase() as RequestMethodType;
    this.header = new ReadonlyHeader(request.headers);
    this.userAgent = this.header.getUserAgent();
    const params: [string, ScalarType][] = [];
    for (const [key, value] of Object.entries(config?.params ?? {})) {
      params.push([key, value]);
    }
    this.params = new ReadonlyCollection(params);

    const payload: [string, unknown][] = [];
    for (const [key, value] of Object.entries(config?.payload ?? {})) {
      payload.push([key, value]);
    }
    this.payload = new ReadonlyCollection(payload);

    this.ip = this.header.get('x-forwarded-for') ||
      this.header.get('remote-addr') ||
      null;
    this.host = this.header.getHost();
    this.referer = this.header.getReferer();
    this.server = this.header.getServer();
    this.bearerToken = this.header.getBearerToken();
  }

  public isXMLHttpRequest(): boolean {
    return this.header.get('X-Requested-With') === 'XMLHttpRequest';
  }
}
