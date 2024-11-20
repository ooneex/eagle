import { JWTHeaderParameters } from 'npm:jose';
import { ERole } from '../security/types.ts';

export type JwtExpiresInType =
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}w`
  | `${number}y`;

export type JwtDefaultPayloadType = {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  jti?: string;
  nbf?: number | string | Date;
  exp?: number | string | Date;
  iat?: number | string | Date;
};

export type JwtPayloadType = JwtDefaultPayloadType & {
  username?: string;
  roles?: ERole[];
  refreshToken?: string;
} & Record<string, unknown>;

export interface IJwt {
  getToken: () => string;
  getPayload: () => JwtPayloadType;
  getHeader: () => JWTHeaderParameters;
  isValid: () => Promise<boolean> | boolean;
  getSecret: () => string | null;
  getUsername: () => string;
  getRoles: () => ERole[];
  getRefreshToken: () => IJwt | null;
}
