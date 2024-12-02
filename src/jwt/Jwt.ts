import * as jose from 'npm:jose@5.9.6';
import { JWTHeaderParameters } from 'npm:jose@5.9.6';
import { EnvConfig } from '../config/EnvConfig.ts';
import { ERole } from '../security/types.ts';
import { IJwt, JwtDefaultPayloadType, JwtPayloadType } from './types.ts';

/**
 * Represents a JSON Web Token (JWT) implementation.
 * Provides functionality for creating, validating, and managing JWT tokens
 * with support for refresh tokens and role-based authorization.
 */
export class Jwt implements IJwt {
  private token: string;
  private secret: string | null;

  /**
   * Creates a new JWT instance
   * @param token - The JWT token string
   * @param secret - Optional secret key for token verification
   */
  constructor(token: string, secret?: string) {
    this.token = token;
    this.secret = secret ?? Jwt.getSecret() ?? null;
  }

  /**
   * Gets the JWT secret from environment variables
   * @returns The JWT secret or null if not set
   */
  public static getSecret(): string | null {
    return Deno.env.get(EnvConfig.KEYS.jwt.secret) ?? null;
  }

  /**
   * Creates a new refresh token
   * @returns Promise resolving to refresh token string or null if secret not set
   */
  public static async createRefreshToken(): Promise<string | null> {
    const secret = Deno.env.get(EnvConfig.KEYS.jwt.refresh.secret);

    if (!secret) return null;

    const exp = Deno.env.get(EnvConfig.KEYS.jwt.refresh.expiresIn) ?? '1d';

    const token = new jose.SignJWT({})
      .setProtectedHeader({ alg: 'HS256' });
    token.setExpirationTime(exp);

    return await token.sign(new TextEncoder().encode(secret));
  }

  /**
   * Creates a new JWT token
   * @param config - Optional configuration for token creation
   * @param secret - Optional secret key for signing
   * @returns Promise resolving to new JWT instance or null if secret not set
   */
  public static async create(
    config?: {
      payload?: JwtDefaultPayloadType;
      data?:
        & { id?: string | null; username?: string; roles?: ERole[] }
        & Record<string, unknown>;
      header?: JWTHeaderParameters;
    },
    secret?: string,
  ): Promise<Jwt | null> {
    const jwtSecret = secret ?? Jwt.getSecret();

    if (!jwtSecret) {
      return null;
    }

    const alg = 'HS256';
    const payload = config?.payload ?? {};

    const token = new jose.SignJWT({
      username: '',
      roles: [],
      refreshToken: await Jwt.createRefreshToken(),
      ...(config?.data ?? {}),
    })
      .setProtectedHeader({ ...{ alg }, ...(config?.header ?? {}) });

    if (payload.iss) {
      token.setIssuer(payload.iss);
    }

    if (payload.sub) {
      token.setSubject(payload.sub);
    }

    if (payload.aud) {
      token.setAudience(payload.aud);
    }

    if (payload.exp) {
      token.setExpirationTime(
        payload.exp ?? Deno.env.get(EnvConfig.KEYS.jwt.expiresIn) ??
          '1h',
      );
    }

    if (payload.iat) {
      token.setIssuedAt(payload.iat);
    }

    if (payload.nbf) {
      token.setNotBefore(payload.nbf);
    }

    if (payload.jti) {
      token.setJti(payload.jti);
    }

    return new Jwt(
      await token.sign(new TextEncoder().encode(jwtSecret)),
    );
  }

  /**
   * Gets the JWT token string
   * @returns The JWT token string
   */
  public getToken(): string {
    return this.token;
  }

  /**
   * Gets the secret key used for token verification
   * @returns The secret key or null if not set
   */
  public getSecret(): string | null {
    return this.secret;
  }

  /**
   * Validates the JWT token
   * @returns Promise resolving to boolean indicating if token is valid
   */
  public async isValid(): Promise<boolean> {
    const secret = this.secret ?? Jwt.getSecret();

    if (!secret) {
      return false;
    }

    try {
      await jose.jwtVerify(
        this.token,
        new TextEncoder().encode(secret),
      );

      return true;
    } catch (_error) {
      return false;
    }
  }

  /**
   * Gets the JWT header
   * @returns Decoded JWT header
   */
  public getHeader<T = JWTHeaderParameters>(): T {
    return jose.decodeProtectedHeader(this.token) as T;
  }

  /**
   * Gets the ID from the JWT payload
   * @returns The ID or null if not present
   */
  public getId(): string | null {
    return this.getPayload().id ?? null;
  }

  /**
   * Gets the full JWT payload
   * @returns Decoded JWT payload
   */
  public getPayload(): JwtPayloadType {
    return jose.decodeJwt(this.token);
  }

  /**
   * Gets the username from the JWT payload
   * @returns The username or empty string if not present
   */
  public getUsername(): string {
    return this.getPayload().username ?? '';
  }

  /**
   * Gets the roles from the JWT payload
   * @returns Array of roles or empty array if not present
   */
  public getRoles(): ERole[] {
    return this.getPayload().roles ?? [];
  }

  /**
   * Gets the refresh token from the JWT payload
   * @returns New JWT instance for refresh token or null if not present/invalid
   */
  public getRefreshToken(): IJwt | null {
    const secret = Deno.env.get(EnvConfig.KEYS.jwt.refresh.secret);
    const token = this.getPayload().refreshToken;

    if (token && secret) {
      return new Jwt(token, secret);
    }

    return null;
  }

  /**
   * Checks if the token can be refreshed
   * @returns Promise resolving to boolean indicating if token can be refreshed
   */
  public async canRefresh(): Promise<boolean> {
    if (await this.isValid()) {
      return false;
    }

    const refreshToken = this.getRefreshToken();

    if (!refreshToken || !(await refreshToken.isValid())) {
      return false;
    }

    return true;
  }
}
