import type { Header } from "@ooneex/header";
import type { CharsetType, StatusCodeType } from "@ooneex/http";
import type { ScalarType } from "@ooneex/types";
import type { BunFile } from "bun";
import type { NotFoundResponse } from "./NotFoundResponse";
import type { RedirectResponse } from "./RedirectResponse";

export interface IResponse {
  readonly data: Record<string, unknown>;
  readonly header: Header;
  status: StatusCodeType | null;
  text: (
    content: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => string | Promise<string>;
  html: (
    content: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => string | Promise<string>;
  js: (
    content: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => string | Promise<string>;
  json: <T = Record<string, any>>(
    data: T,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => T | Promise<T>;
  file: (
    path: string,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => BunFile | Promise<BunFile>;
  notFound: (
    message: string,
    data?: Record<string, ScalarType>,
    status?: StatusCodeType,
  ) => NotFoundResponse | Promise<NotFoundResponse>;
  redirect: (
    url: string | URL,
    status?: StatusCodeType,
  ) => RedirectResponse | Promise<RedirectResponse>;
}
