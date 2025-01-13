import type { DB } from './db.ts';
import type { HEADER_FIELDS } from './header_fields.ts';
import type { HTTP_METHODS } from './methods.ts';
import type { HTTP_PROTOCOLS } from './protocols.ts';
import type { StatusCode, StatusText } from './status.ts';

export type MimeType = keyof DB;

export type MethodType = (typeof HTTP_METHODS)[number];

export type ProtocolType = (typeof HTTP_PROTOCOLS)[number];

export type HeaderFieldType = (typeof HEADER_FIELDS)[number] | string;

export type { StatusCode as StatusCodeType };

export type { StatusText as StatusTextType };

export type EncodingType =
  | 'deflate'
  | 'gzip'
  | 'compress'
  | 'br'
  | 'identity'
  | '*';

export type CharsetType =
  | 'ISO-8859-1'
  | '7-BIT'
  | 'UTF-8'
  | 'UTF-16'
  | 'US-ASCII';
