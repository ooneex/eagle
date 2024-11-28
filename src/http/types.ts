import { StatusCode, StatusText } from 'jsr:@std/http/status';
import { type DB } from 'jsr:@std/media-types';
import { HEADER_FIELDS } from './header_fields.ts';
import { HTTP_METHODS } from './methods.ts';
import { HTTP_PROTOCOLS } from './protocols.ts';

export type MimeType = keyof DB;

export type MethodType = (typeof HTTP_METHODS)[number];
export type ProtocolType = (typeof HTTP_PROTOCOLS)[number];
export type HeaderFieldType = (typeof HEADER_FIELDS)[number] | string;
export type StatusCodeType = StatusCode;
export type StatusTextType = StatusText;

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
