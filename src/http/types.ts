import type { DB } from './db.ts';
import type { HEADER_FIELDS } from './header_fields.ts';
import type { HTTP_METHODS } from './methods.ts';
import type { HTTP_PROTOCOLS } from './protocols.ts';
import type { StatusCode, StatusText } from './status.ts';

/** MIME type from media types database */
export type MimeType = keyof typeof DB;

/** HTTP method type (GET, POST, etc) */
export type MethodType = (typeof HTTP_METHODS)[number];

/** HTTP protocol type (HTTP/1.0, HTTP/1.1, etc) */
export type ProtocolType = (typeof HTTP_PROTOCOLS)[number];

/** HTTP header field name */
export type HeaderFieldType = (typeof HEADER_FIELDS)[number] | string;

/** HTTP status code (200, 404, etc) */
export type { StatusCode as StatusCodeType };

/** HTTP status text ("OK", "Not Found", etc) */
export type { StatusText as StatusTextType };

/** HTTP content encoding types */
export type EncodingType =
  | 'deflate'
  | 'gzip'
  | 'compress'
  | 'br'
  | 'identity'
  | '*';

/** HTTP character set encoding types */
export type CharsetType =
  | 'ISO-8859-1'
  | '7-BIT'
  | 'UTF-8'
  | 'UTF-16'
  | 'US-ASCII';
