import { EXTENSIONS } from '@/http/extensions.ts';
import { HEADER_FIELDS } from '@/http/header_fields.ts';
import { HTTP_METHODS } from '@/http/methods.ts';
import { MIME_DB } from '@/http/mime_db.ts';
import { HTTP_PROTOCOLS } from '@/http/protocols.ts';
import { STATUS_CODE, STATUS_TEXT } from '@std/http/status';

export type MimeType = keyof typeof MIME_DB;
export type ExtensionType = (typeof EXTENSIONS)[number];

export type MimeDefinitionType = {
  source?: 'apache' | 'iana' | 'nginx';
  charset?: '7-BIT' | 'UTF-8' | 'US-ASCII';
  compressible?: boolean;
  extensions?: ExtensionType[];
};

export type MethodType = (typeof HTTP_METHODS)[number];
export type ProtocolType = (typeof HTTP_PROTOCOLS)[number];
export type HeaderFieldType = (typeof HEADER_FIELDS)[number] | string;
export type StatusTextType = keyof typeof STATUS_TEXT;
export type StatusCodeType = keyof typeof STATUS_CODE;

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
