import { Header } from '@/header/Header.ts';
import { CharsetType, StatusCodeType } from '@/http/types.ts';

export interface IResponse {
  readonly header: Header;
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
  build: () => Response;
}
