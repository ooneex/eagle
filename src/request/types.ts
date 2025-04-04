import type { IReadonlyCollection } from '../collection/types';
import type { ControllerMethodType } from '../controller/types';
import type { IReadonlyHeader, IUserAgent } from '../header/types';
import type { Cookie as CookieType } from '../http/cookie';
import type { MimeType } from '../http/types';
import type { LocaleType } from '../locale/locales';
import type { IStorage } from '../storage/types';
import type { ScalarType } from '../types';
import type { IUrl } from '../url/types';

export type RequestMethodType = ControllerMethodType;

export interface IRequest {
  readonly path: string;
  readonly url: IUrl;
  readonly method: RequestMethodType;
  readonly header: IReadonlyHeader;
  readonly userAgent: IUserAgent;
  readonly params: IReadonlyCollection<string, ScalarType>;
  readonly payload: IReadonlyCollection<string, any>;
  readonly queries: IReadonlyCollection<string, ScalarType>;
  readonly cookies: IReadonlyCollection<string, CookieType>;
  readonly form: IReadonlyCollection<string, any>;
  readonly files: IReadonlyCollection<string, IRequestFile>;
  readonly ip: string | null;
  readonly host: string | null;
  readonly referer: string | null;
  readonly server: string | null;
  readonly bearerToken: string | null;
  readonly lang: LanguageType | null;
  readonly native: Readonly<Request>;
}

export interface IRequestFile {
  readonly name: string;
  readonly originalName: string;
  readonly type: MimeType;
  readonly size: number;
  readonly extension: string;
  readonly isImage: boolean;
  readonly isVideo: boolean;
  readonly isAudio: boolean;
  readonly isPdf: boolean;
  readonly isText: boolean;
  readonly isExcel: boolean;
  readonly isCsv: boolean;
  readonly isJson: boolean;
  readonly isXml: boolean;
  readonly isHtml: boolean;
  readonly isSvg: boolean;
  readAsArrayBuffer(): Promise<ArrayBuffer>;
  readAsStream(): ReadableStream<Uint8Array>;
  readAsText(): Promise<string>;
  write(path: string): Promise<void>;
  store(storage: IStorage, directory?: string): Promise<string>;
}

export type LanguageType = {
  code: LocaleType;
  region: string | null;
};
