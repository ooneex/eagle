import { EnvConfig } from '@/config/mod.ts';
import { Jwt } from '@/jwt/mod.ts';
import { ERole } from '@/security/mod.ts';
import { expect } from '@std/expect';
import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';

describe('Jwt', () => {
  const secret = 'test-secret-key';
  const testPayload = {
    sub: 'user123',
    iss: 'test-issuer',
    aud: 'test-audience',
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
    jti: 'unique-token-id',
  };
  const testData = {
    userId: 123,
    role: 'admin',
  };

  beforeEach(() => {
    Deno.env.set(EnvConfig.KEYS.jwt.secret, secret);
  });

  afterEach(() => {
    Deno.env.delete(EnvConfig.KEYS.jwt.refresh.secret);
  });

  describe('create()', () => {
    it('should create a JWT with default values', async () => {
      const jwt = await Jwt.create();
      expect(jwt).toBeDefined();
      expect(await jwt?.isValid()).toBe(true);
    });

    it('should create a JWT with custom payload and data', async () => {
      const jwt = await Jwt.create({
        payload: testPayload,
        data: testData,
      });

      const payload = jwt?.getPayload();
      const header = jwt?.getHeader();

      expect(payload?.sub).toBe(testPayload.sub);
      expect(payload?.iss).toBe(testPayload.iss);
      expect(payload?.aud).toBe(testPayload.aud);
      expect(payload?.jti).toBe(testPayload.jti);
      expect((payload as unknown as typeof testData).userId).toBe(
        testData.userId,
      );
      expect(header?.alg).toBe('HS256');
    });
  });

  describe('isValid()', () => {
    it('should return true for valid token', async () => {
      const jwt = await Jwt.create();
      expect(await jwt?.isValid()).toBe(true);
    });

    it('should return false for invalid token', async () => {
      const jwt = new Jwt('invalid-token', secret);
      expect(await jwt?.isValid()).toBe(false);
    });

    it('should return false when wrong secret is used', async () => {
      const jwt = await Jwt.create();
      const jwtWithWrongSecret = new Jwt(jwt?.getToken()!, 'wrong-secret');
      expect(await jwtWithWrongSecret.isValid()).toBe(false);
    });
  });

  describe('getters', () => {
    it('should return correct secret', async () => {
      const jwt = await Jwt.create();
      expect(jwt?.getSecret()).toBe(secret);
    });

    it('should return token string', async () => {
      const jwt = await Jwt.create();
      expect(jwt?.getToken()).toBeDefined();
      expect(typeof jwt?.getToken()).toBe('string');
    });
  });

  describe('payload and header access', () => {
    it('should correctly retrieve custom data from payload', async () => {
      const jwt = await Jwt.create({
        data: { customField: 'test-value' },
      });

      const payload = jwt?.getPayload();
      expect(payload?.customField).toBe('test-value');
    });

    it('should correctly retrieve header data', async () => {
      const customHeader = { kid: 'test-key-id', alg: 'HS256' };
      const jwt = await Jwt.create({
        header: customHeader,
      });

      const header = jwt?.getHeader<typeof customHeader & { alg: string }>();
      expect(header?.kid).toBe('test-key-id');
      expect(header?.alg).toBe('HS256');
    });
  });

  describe('username and roles access', () => {
    it('should correctly retrieve username', async () => {
      const jwt = await Jwt.create();
      expect(jwt?.getUsername()).toBe('');
    });

    it('should correctly retrieve roles', async () => {
      const jwt = await Jwt.create();
      expect(jwt?.getRoles()).toEqual([]);
    });

    it('should correctly retrieve username and roles', async () => {
      const jwt = await Jwt.create({
        data: { username: 'test-username', roles: [ERole.ADMIN] },
      });
      expect(jwt?.getUsername()).toBe('test-username');
      expect(jwt?.getRoles()).toEqual([ERole.ADMIN]);
    });
  });

  describe('getId()', () => {
    it('should return null when id is not set', async () => {
      const jwt = await Jwt.create();
      expect(jwt?.getId()).toBeNull();
    });

    it('should correctly retrieve id when set', async () => {
      const jwt = await Jwt.create({
        data: { id: 'test-id' },
      });
      expect(jwt?.getId()).toBe('test-id');
    });
  });

  describe('refresh token', () => {
    it('should return null when refresh token is not set', async () => {
      const jwt = await Jwt.create();
      expect(jwt?.getRefreshToken()).toBeNull();
    });

    it('should return a valid refresh token when properly configured', async () => {
      const refreshSecret = 'test-refresh-secret';
      Deno.env.set(EnvConfig.KEYS.jwt.refresh.secret, refreshSecret);

      const jwt = await Jwt.create();
      const refreshToken = jwt?.getRefreshToken();

      expect(refreshToken).not.toBeNull();
      expect(refreshToken?.getSecret()).toBe(refreshSecret);
      expect(await refreshToken?.isValid()).toBe(true);
    });

    it('should create refresh token with correct expiration', async () => {
      const refreshSecret = 'test-refresh-secret';
      const expiresIn = '2d';
      Deno.env.set(EnvConfig.KEYS.jwt.refresh.secret, refreshSecret);
      Deno.env.set(EnvConfig.KEYS.jwt.refresh.expiresIn, expiresIn);

      const jwt = await Jwt.create();
      const refreshToken = jwt?.getRefreshToken();
      const payload = refreshToken?.getPayload();

      expect(payload?.exp).toBeDefined();
      const expDate = new Date((payload?.exp as number) * 1000);
      const now = new Date();
      const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

      // Allow 5 seconds tolerance for test execution time
      expect(Math.abs(expDate.getTime() - twoDaysFromNow.getTime()))
        .toBeLessThan(5000);

      Deno.env.delete(EnvConfig.KEYS.jwt.refresh.secret);
      Deno.env.delete(EnvConfig.KEYS.jwt.refresh.expiresIn);
    });
  });

  describe('canRefresh()', () => {
    it('should return false when JWT is still valid', async () => {
      const jwt = await Jwt.create();
      expect(await jwt?.canRefresh()).toBe(false);
    });

    it('should return false when JWT is invalid and no refresh token exists', async () => {
      const expiredJwt = await Jwt.create({
        payload: { exp: new Date(Date.now() - 1000) },
      });
      expect(await expiredJwt?.canRefresh()).toBe(false);
    });

    it('should return false when JWT is invalid and refresh token is invalid', async () => {
      const refreshSecret = 'test-refresh-secret';
      Deno.env.set(EnvConfig.KEYS.jwt.refresh.secret, refreshSecret);

      const expiredJwt = await Jwt.create({
        payload: { exp: 0 },
      });

      expect(await expiredJwt?.canRefresh()).toBe(false);
    });

    it('should return true when JWT is invalid but refresh token is valid', async () => {
      const refreshSecret = 'test-refresh-secret';
      Deno.env.set(EnvConfig.KEYS.jwt.refresh.secret, refreshSecret);

      const expiredJwt = await Jwt.create({
        payload: { exp: new Date(Date.now() - 1000) },
      });

      expect(await expiredJwt?.canRefresh()).toBe(true);
    });
  });
});
