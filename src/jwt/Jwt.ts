import { JwtDefaultPayloadType } from '@/jwt/types.ts';
import * as jose from '@jwt';
import { JWTHeaderParameters } from '@jwt';

export class Jwt {
  private secret: string;
  private token: string;

  constructor(token: string, secret: string) {
    this.token = token;
    this.secret = secret;
  }

  public static async create(
    secret: string,
    config?: {
      payload?: JwtDefaultPayloadType;
      data?: Record<string, unknown>;
      header?: JWTHeaderParameters;
    },
  ): Promise<Jwt> {
    const alg = 'HS256';
    const payload = config?.payload ?? {};

    const token = new jose.SignJWT(config?.data ?? {})
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
      token.setExpirationTime(payload.exp);
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

    return new Jwt(await token.sign(new TextEncoder().encode(secret)), secret);
  }

  public getSecret(): string {
    return this.secret;
  }

  public getToken(): string {
    return this.token;
  }

  public async isValid(): Promise<boolean> {
    try {
      await jose.jwtVerify(
        this.token,
        new TextEncoder().encode(this.secret),
      );

      return true;
    } catch (_error) {
      console.error(_error);
      return false;
    }
  }

  public getHeader<T = JWTHeaderParameters>(): T {
    return jose.decodeProtectedHeader(this.token) as T;
  }

  public getPayload<T = unknown>(): JwtDefaultPayloadType & T {
    return jose.decodeJwt(this.token) as JwtDefaultPayloadType & T;
  }
}
