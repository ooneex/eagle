import * as jose from 'npm:jose';
import { JWTHeaderParameters } from 'npm:jose';
import { EnvConfig } from '../config/EnvConfig.ts';
import { ERole } from '../security/types.ts';
import { IJwt, JwtDefaultPayloadType, JwtPayloadType } from './types.ts';

export class Jwt implements IJwt {
  private token: string;
  private secret: string | null;

  constructor(token: string, secret?: string) {
    this.token = token;
    this.secret = secret ?? Jwt.getSecret() ?? null;
  }

  public static getSecret(): string | null {
    return Deno.env.get(EnvConfig.KEYS.jwt.secret) ?? null;
  }

  public static async createRefreshToken(): Promise<string | null> {
    const secret = Deno.env.get(EnvConfig.KEYS.jwt.refresh.secret);

    if (!secret) return null;

    const exp = Deno.env.get(EnvConfig.KEYS.jwt.refresh.expiresIn) ?? '1d';

    const token = new jose.SignJWT({})
      .setProtectedHeader({ alg: 'HS256' });
    token.setExpirationTime(exp);

    return await token.sign(new TextEncoder().encode(secret));
  }

  public static async create(
    config?: {
      payload?: JwtDefaultPayloadType;
      data?:
        & { username?: string; roles?: ERole[] }
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
      roles: [ERole.ANON],
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

  public getToken(): string {
    return this.token;
  }

  public getSecret(): string | null {
    return this.secret;
  }

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

  public getHeader<T = JWTHeaderParameters>(): T {
    return jose.decodeProtectedHeader(this.token) as T;
  }

  public getPayload(): JwtPayloadType {
    return jose.decodeJwt(this.token);
  }

  public getUsername(): string {
    return this.getPayload().username ?? '';
  }

  public getRoles(): ERole[] {
    return this.getPayload().roles ?? [];
  }

  public getRefreshToken(): IJwt | null {
    const secret = Deno.env.get(EnvConfig.KEYS.jwt.refresh.secret);
    const token = this.getPayload().refreshToken;

    if (token && secret) {
      return new Jwt(token, secret);
    }

    return null;
  }

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
