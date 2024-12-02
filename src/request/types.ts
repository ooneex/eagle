import { Cookie } from 'jsr:@std/http@1.0.10/cookie';
import { IReadonlyCollection } from '../collection/types.ts';
import { ControllerMethodType } from '../controller/types.ts';
import { IReadonlyHeader, IUserAgent } from '../header/types.ts';
import { Jwt } from '../jwt/Jwt.ts';
import { LocaleType } from '../locale/locales.ts';
import { IAuth } from '../security/types.ts';
import { ScalarType } from '../types.ts';
import { IUrl } from '../url/types.ts';

/** Type alias for HTTP request methods */
export type RequestMethodType = ControllerMethodType;

/** Interface representing an HTTP request */
export interface IRequest {
  /** Authentication information */
  auth: IAuth | null;
  /** Request path */
  path: string;
  /** Parsed URL object */
  url: IUrl;
  /** HTTP method */
  method: RequestMethodType;
  /** Request headers */
  header: IReadonlyHeader;
  /** User agent info */
  userAgent: IUserAgent;
  /** Route parameters */
  params: IReadonlyCollection<string, ScalarType>;
  /** Request payload/body */
  payload: IReadonlyCollection<string, unknown>;
  /** Query parameters */
  queries: IReadonlyCollection<string, ScalarType>;
  /** HTTP cookies */
  cookies: IReadonlyCollection<string, Cookie>;
  /** Form data */
  form: IReadonlyCollection<string, unknown>;
  /** Uploaded files */
  files: IReadonlyCollection<string, IRequestFile>;
  /** Client IP address */
  ip: string | null;
  /** Host header */
  host: string | null;
  /** Referrer header */
  referer: string | null;
  /** Server name */
  server: string | null;
  /** Bearer authentication token */
  bearerToken: string | null;
  /** JWT token */
  jwt: Jwt | null;
  /** Checks if request is AJAX */
  isXMLHttpRequest: () => boolean;
}

/** Interface representing an uploaded file */
export interface IRequestFile {
  /** Generated file name */
  name: string;
  /** Original file name */
  originalName: string;
  /** File MIME type */
  type: string;
  /** File size in bytes */
  size: number;
  /** File extension */
  extension: string;
  /** Whether file is an image */
  isImage: boolean;
  /** Get file contents as ArrayBuffer */
  getData: () => Promise<ArrayBuffer>;
  /** Get file contents as stream */
  getStream: () => ReadableStream<Uint8Array>;
  /** Write file to disk */
  write: (path: string, options?: Deno.WriteFileOptions) => Promise<void>;
}

/** Type representing a language code and region */
export type LanguageType = {
  /** Language code */
  code: LocaleType;
  /** Optional region code */
  region: string | null;
};
