import { Cookie } from 'jsr:@std/http/cookie';
import { IReadonlyCollection } from '../collection/types.ts';
import { ControllerMethodType } from '../controller/types.ts';
import { IReadonlyHeader, IUserAgent } from '../header/types.ts';
import { Jwt } from '../jwt/Jwt.ts';
import { LocaleType } from '../locale/locales.ts';
import { IAuth } from '../security/types.ts';
import { ScalarType } from '../types.ts';
import { IUrl } from '../url/types.ts';

export type RequestMethodType = ControllerMethodType;

export interface IRequest {
  auth: IAuth | null;
  path: string;
  url: IUrl;
  method: RequestMethodType;
  header: IReadonlyHeader;
  userAgent: IUserAgent;
  params: IReadonlyCollection<string, ScalarType>;
  payload: IReadonlyCollection<string, unknown>;
  queries: IReadonlyCollection<string, ScalarType>;
  cookies: IReadonlyCollection<string, Cookie>;
  form: IReadonlyCollection<string, unknown>;
  files: IReadonlyCollection<string, IRequestFile>;
  ip: string | null;
  host: string | null;
  referer: string | null;
  server: string | null;
  bearerToken: string | null;
  jwt: Jwt | null;
  isXMLHttpRequest: () => boolean;
}

export interface IRequestFile {
  name: string;
  originalName: string;
  type: string;
  size: number;
  getData: () => Promise<ArrayBuffer>;
  getStream: () => ReadableStream<Uint8Array>;
  write: (path: string, options?: Deno.WriteFileOptions) => Promise<void>;
}

export type LanguageType = {
  code: LocaleType;
  region: string | null;
};
