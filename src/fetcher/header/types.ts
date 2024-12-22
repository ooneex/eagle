import {
  CharsetType,
  EncodingType,
  HeaderFieldType,
  MethodType,
  MimeType,
} from '../../http/types.ts';

/**
 * Interface representing a header checker.
 */
export interface IHeaderChecker {
  isBlob: () => boolean;
  isJson: () => boolean;
  isStream: () => boolean;
  isText: () => boolean;
  isFormData: () => boolean;
  isHtml: () => boolean;
}

/**
 * Represents a readonly header object that provides methods for accessing various header fields.
 */
export interface IReadonlyHeader extends IHeaderChecker {
  readonly native: Headers;
  get: (name: HeaderFieldType) => string | null;
  getAllow: () => MethodType | null;
  getAccept: () => MimeType | '*/*' | null;
  getAcceptEncoding: () => EncodingType[] | null;
  getContentLength: () => number | null;
  getContentType: () => MimeType | '*/*' | null;
  getContentDisposition: () => string | null;
  getAuthorization: () => string | null;
  getBasicAuth: () => string | null;
  getBearerToken: () => string | null;
  getCookie: () => string | null;
  getHost: () => string | null;
  getReferer: () => string | null;
  getRefererPolicy: () => string | null;
  getServer: () => string | null;
  getCustom: () => string | null;
  getCharset: () => CharsetType | null;
  getCacheControl: () => string | null;
  getEtag: () => string | null;
  has: (name: HeaderFieldType) => boolean;
  keys: () => HeaderFieldType[];
  count: () => number;
  hasData: () => boolean;
  [Symbol.iterator](): IterableIterator<[HeaderFieldType, any]>;
  toJson: () => Record<string, string>;
}

/**
 * Header interface for representing HTTP headers.
 */
export interface IHeader extends IReadonlyHeader {
  readonly native: Headers;
}
