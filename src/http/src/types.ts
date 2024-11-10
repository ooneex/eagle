import type { EXTENSIONS } from "./extensions";
import type { HEADER_FIELDS } from "./header_fields";
import type { STATUS_CODE, STATUS_CODE_TEXT } from "./http_status";
import type { HTTP_METHODS } from "./methods";
import type { MIME_DB } from "./mime_db";
import type { HTTP_PROTOCOLS } from "./protocols";

/**
 * Represents a MIME type.
 */
export type MimeType = keyof typeof MIME_DB;

/**
 * Represents a type of extension.
 */
export type ExtensionType = (typeof EXTENSIONS)[number];

/**
 * Represents the definition of a MIME type.
 */
export type MimeDefinitionType = {
  source?: "apache" | "iana" | "nginx";
  charset?: "7-BIT" | "UTF-8" | "US-ASCII";
  compressible?: boolean;
  extensions?: ExtensionType[];
};

/**
 * Represents a type that defines the available HTTP methods.
 */
export type MethodType = (typeof HTTP_METHODS)[number];

/**
 * Represents a protocol type.
 */
export type ProtocolType = (typeof HTTP_PROTOCOLS)[number];

/**
 * Represents the type of header field.
 */
export type HeaderFieldType = (typeof HEADER_FIELDS)[number];

/**
 * Represents a type for HTTP status code.
 */
export type StatusCodeType = keyof typeof STATUS_CODE_TEXT;

/**
 * Represents a key type for status codes.
 */
export type StatusCodeKeyType = keyof typeof STATUS_CODE;

/**
 * Represents the encoding types supported for HTTP response bodies.
 */
export type EncodingType =
  | "deflate"
  | "gzip"
  | "compress"
  | "br"
  | "identity"
  | "*";

/**
 * Represents the type of character set for encoding and decoding text.
 */
export type CharsetType =
  | "ISO-8859-1"
  | "7-BIT"
  | "UTF-8"
  | "UTF-16"
  | "US-ASCII";
