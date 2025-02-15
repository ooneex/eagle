import type { IReadonlyArrayCollection } from '../collection/types';
import type { IHeader } from '../header/types';
import type { Cookie as CookieType } from '../http/cookie';
import type { CharsetType, StatusCodeType } from '../http/types';
import type { IRequest } from '../request/types';
import type { IUser } from '../security/types';

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
  build: (
    request: IRequest,
    cxt?: { user?: IUser; isAuthenticated?: boolean },
  ) => Response;
  isSuccessful: () => boolean;
  isInformational: () => boolean;
  isRedirect: () => boolean;
  isClientError: () => boolean;
  isServerError: () => boolean;
  isError: () => boolean;
}
