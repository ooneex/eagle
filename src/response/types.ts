import type { IReadonlyArrayCollection } from '@/collection/types.ts';
import type { CookieType } from '@/cookie/types.ts';
import type { IHeader } from '@/header/types.ts';
import type { CharsetType, StatusCodeType } from '@/http/types.ts';
import type { IRequest } from '@/request/types.ts';

export interface IResponse {
  readonly header: IHeader;
  readonly cookies: IReadonlyArrayCollection<CookieType>;
  json: (
    data: Record<string, unknown>,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => this;
  stream: (data: string | ReadableStream, status?: StatusCodeType) => this;
  exception: (
    message: string,
    data?: Record<string, unknown> | null,
    status?: StatusCodeType,
  ) => this;
  notFound: (
    message: string,
    data?: Record<string, unknown> | null,
    status?: StatusCodeType,
  ) => this;
  redirect: (url: string | URL, status?: StatusCodeType) => Response;
  getData: () => Record<string, unknown> | ReadableStream | null;
  build: (request: IRequest) => Response;
  isSuccessful: () => boolean;
  isInformational: () => boolean;
  isRedirect: () => boolean;
  isClientError: () => boolean;
  isServerError: () => boolean;
  isError: () => boolean;
}
