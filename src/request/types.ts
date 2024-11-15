import { IReadonlyCollection } from '@/collection/types.ts';
import { ControllerMethodType } from '@/controller/types.ts';
import { IReadonlyHeader, IUserAgent } from '@/header/types.ts';
import { Jwt } from '@/jwt/Jwt.ts';
import { IAuth } from '@/security/types.ts';
import { ScalarType } from '@/types.ts';
import { IUrl } from '@/url/types.ts';
import { Cookie } from '@std/http/cookie';

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
  ip: string | null;
  host: string | null;
  referer: string | null;
  server: string | null;
  bearerToken: string | null;
  jwt: Jwt | null;
  isXMLHttpRequest: () => boolean;
}
