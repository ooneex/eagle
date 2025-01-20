import type { DB } from './db';
import type { HEADER_FIELDS } from './header_fields';
import type { HTTP_METHODS } from './methods';
import type { HTTP_PROTOCOLS } from './protocols';
import type { StatusCode, StatusText } from './status';

export type MimeType = keyof typeof DB;

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
