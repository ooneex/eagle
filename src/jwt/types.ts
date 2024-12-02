import { JWTHeaderParameters } from 'npm:jose@5.9.6';
import { ERole } from '../security/types.ts';

/**
 * Valid formats for JWT expiration time
 * s = seconds, m = minutes, h = hours, d = days, w = weeks, y = years
 */
export type JwtExpiresInType =
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}w`
  | `${number}y`;

/**
 * Standard JWT payload claims as defined in RFC 7519
 * @property iss - Token issuer
 * @property sub - Token subject
 * @property aud - Token audience
 * @property jti - JWT ID
 * @property nbf - Not valid before time
 * @property exp - Expiration time
 * @property iat - Issued at time
 */
export type JwtDefaultPayloadType = {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  jti?: string;
  nbf?: number | string | Date;
  exp?: number | string | Date;
  iat?: number | string | Date;
};

/**
 * Extended JWT payload type with custom claims
 * Includes all standard claims plus application-specific fields
 */
export type JwtPayloadType = JwtDefaultPayloadType & {
  id?: string | null;
  username?: string;
  roles?: ERole[];
  refreshToken?: string;
} & Record<string, unknown>;

/**
 * Interface defining JWT token operations
 * @interface IJwt
 */
export interface IJwt {
  /** Get the raw JWT token string */
  getToken: () => string;
  /** Get the decoded JWT payload */
  getPayload: () => JwtPayloadType;
  /** Get the JWT header parameters */
  getHeader: () => JWTHeaderParameters;
  /** Check if the token is valid */
  isValid: () => Promise<boolean> | boolean;
  /** Get the token secret */
  getSecret: () => string | null;
  /** Get the user ID from the token */
  getId: () => string | null;
  /** Get the username from the token */
  getUsername: () => string;
  /** Get the user roles from the token */
  getRoles: () => ERole[];
  /** Get the refresh token if present */
  getRefreshToken: () => IJwt | null;
}
