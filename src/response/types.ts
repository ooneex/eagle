import { Cookie } from 'jsr:@std/http/cookie';
import { IReadonlyArrayCollection } from '../collection/types.ts';
import { Header } from '../header/Header.ts';
import { CharsetType, StatusCodeType } from '../http/types.ts';
import { IRequest } from '../request/types.ts';

export interface IResponse {
  readonly header: Header;
  readonly cookies: IReadonlyArrayCollection<Cookie>;
  text: (
    content: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => this;
  html: (
    content: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => this;
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
  getData: () => Record<string, unknown>;
  build: (request: IRequest) => Response;
  isSuccessful: () => boolean;
  isInformational: () => boolean;
  isRedirect: () => boolean;
  isClientError: () => boolean;
  isServerError: () => boolean;
  isError: () => boolean;
}
