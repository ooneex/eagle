import { IReadonlyCollection } from '@/collection/types.ts';
import { ControllerMethodType } from '@/controller/types.ts';
import { IReadonlyHeader, IUserAgent } from '@/header/types.ts';
import { ScalarType } from '@/types.ts';
import { IUrl } from '@/url/types.ts';

export type RequestMethodType = ControllerMethodType;

export interface IRequest {
  path: string;
  url: IUrl;
  method: RequestMethodType;
  header: IReadonlyHeader;
  userAgent: IUserAgent;
  params: IReadonlyCollection<string, ScalarType>;
  payload: IReadonlyCollection<string, unknown>;
  queries: IReadonlyCollection<string, ScalarType>;
  ip: string | null;
  host: string | null;
  referer: string | null;
  server: string | null;
  bearerToken: string | null;
  isXMLHttpRequest: () => boolean;
}
