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

export type JwtPayloadType = JwtDefaultPayloadType & Record<string, unknown>;
