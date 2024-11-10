import type {
  CharsetType,
  EncodingType,
  HeaderFieldType,
  MethodType,
  MimeType,
} from "@ooneex/http";

/**
 * Represents the type of user agent.
 */
export type UserAgentType = {
  browser: {
    name?: string;
    version?: string;
    major?: string;
  };
  engine: {
    name?: string;
    version?: string;
  };
  os: {
    name?: string;
    version?: string;
  };
  device: {
    vendor?: string;
    model?: string;
    type?: string;
  };
  cpu: {
    architecture?: string;
  };
};

/**
 * Represents the browser type of user agent.
 */
export type UserAgentBrowserType = UserAgentType["browser"];

/**
 * Represents the engine type of user agent.
 */
export type UserAgentEngineType = UserAgentType["engine"];

/**
 * Represents the type of operating system of a user agent.
 */
export type UserAgentOsType = UserAgentType["os"];

/**
 * Represents the device type of a user agent.
 */
export type UserAgentDeviceType = UserAgentType["device"];

/**
 * Represents the CPU type of user agent.
 */
export type UserAgentCpuType = UserAgentType["cpu"];

/**
 * Represents a user agent.
 */
export interface IUserAgent {
  readonly browser: UserAgentBrowserType;
  readonly engine: UserAgentEngineType;
  readonly os: UserAgentOsType;
  readonly device: UserAgentDeviceType;
  readonly cpu: UserAgentCpuType;
}

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
  getAccept: () => MimeType | "*/*" | null;
  getAcceptEncoding: () => EncodingType[] | null;
  getContentLength: () => number | null;
  getContentType: () => MimeType | "*/*" | null;
  getContentDisposition: () => string | null;
  getUserAgent: () => IUserAgent;
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
