import type {
  CharsetType,
  EncodingType,
  HeaderFieldType,
  MethodType,
  MimeType,
} from '../http/types';

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

export type UserAgentBrowserType = UserAgentType['browser'];
export type UserAgentEngineType = UserAgentType['engine'];
export type UserAgentOsType = UserAgentType['os'];
export type UserAgentDeviceType = UserAgentType['device'];
export type UserAgentCpuType = UserAgentType['cpu'];

export interface IUserAgent {
  readonly browser: UserAgentBrowserType;
  readonly engine: UserAgentEngineType;
  readonly os: UserAgentOsType;
  readonly device: UserAgentDeviceType;
  readonly cpu: UserAgentCpuType;
}

export interface IHeaderChecker {
  isBlob: () => boolean;
  isJson: () => boolean;
  isStream: () => boolean;
  isText: () => boolean;
  isFormData: () => boolean;
  isHtml: () => boolean;
}

export interface IReadonlyHeader extends IHeaderChecker {
  readonly native: Headers;
  get: (name: HeaderFieldType) => string | null;
  getAllow: () => MethodType[] | null;
  getAccept: () => MimeType | '*/*' | null;
  getAcceptEncoding: () => EncodingType[] | null;
  getContentLength: () => number | null;
  getContentType: () => MimeType | '*/*' | null;
  getContentDisposition: () => string | null;
  getUserAgent: () => IUserAgent;
  getAuthorization: () => string | null;
  getBasicAuth: () => string | null;
  getBearerToken: () => string | null;
  getCookie: () => string | null;
  getHost: () => string | null;
  getIp: () => string | null;
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

export interface IHeader extends IReadonlyHeader {
  readonly native: Headers;
}
