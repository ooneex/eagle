import { ReadonlyCollection } from '@/collection/ReadonlyCollection.ts';
import type { IReadonlyCollection } from '@/collection/types.ts';
import { ReadonlyHeader } from '@/header/ReadonlyHeader.ts';
import type { IReadonlyHeader, IUserAgent } from '@/header/types.ts';
import { parseString } from '@/helper/parseString.ts';
import type { LocaleType } from '@/locale/locales.ts';
import type { ScalarType } from '@/types.ts';
import { Url } from '@/url/Url.ts';
import type { IUrl } from '@/url/types.ts';
import { type Cookie as CookieType, getSetCookies } from '@std/http/cookie';
import parser from 'accept-language-parser';
import { RequestFile } from './RequestFile.ts';
import type {
  IRequest,
  IRequestFile,
  LanguageType,
  RequestMethodType,
} from './types.ts';

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
  public readonly cookies: IReadonlyCollection<string, CookieType>;
  public readonly files: IReadonlyCollection<string, IRequestFile>;
  public readonly form: IReadonlyCollection<string, unknown>;
  public readonly lang: LanguageType | null = null;

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

    const cookies = getSetCookies(this.native.headers);
    const cookiesArray: [string, CookieType][] = [];
    for (const cookie of cookies) {
      cookie.value = parseString(`${cookie.value}`);
      cookiesArray.push([cookie.name, cookie]);
    }
    this.cookies = new ReadonlyCollection(cookiesArray);

    const formArray: [string, unknown][] = [];
    const filesArray: [string, IRequestFile][] = [];
    if (config?.formData) {
      config.formData.forEach((value, key) => {
        if (value instanceof File) {
          filesArray.push([key, new RequestFile(value)]);
        } else {
          formArray.push([key, parseString(`${value}`)]);
        }
      });
    }
    this.files = new ReadonlyCollection(filesArray);
    this.form = new ReadonlyCollection(formArray);

    const customLang = this.header.get('X-Custom-Lang');
    if (customLang) {
      this.lang = {
        code: customLang as LocaleType,
        region: null,
      };
    } else {
      const languages = parser.parse(
        this.header.get('Accept-Language') ?? undefined,
      );
      const language = languages[0];
      if (language) {
        this.lang = {
          code: language.code as LocaleType,
          region: language.region ?? null,
        };
      }
    }
  }
}
