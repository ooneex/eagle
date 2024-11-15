import { Jwt } from '@/jwt/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

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

  describe('create()', () => {
    it('should create a JWT with default values', async () => {
      const jwt = await Jwt.create(secret);
      expect(jwt).toBeDefined();
      expect(await jwt.isValid()).toBe(true);
    });

    it('should create a JWT with custom payload and data', async () => {
      const jwt = await Jwt.create(secret, {
        payload: testPayload,
        data: testData,
      });

      const payload = jwt.getPayload();
      const header = jwt.getHeader();

      expect(payload.sub).toBe(testPayload.sub);
      expect(payload.iss).toBe(testPayload.iss);
      expect(payload.aud).toBe(testPayload.aud);
      expect(payload.jti).toBe(testPayload.jti);
      expect((payload as unknown as typeof testData).userId).toBe(
        testData.userId,
      );
      expect(header.alg).toBe('HS256');
    });
  });

  describe('isValid()', () => {
    it('should return true for valid token', async () => {
      const jwt = await Jwt.create(secret);
      expect(await jwt.isValid()).toBe(true);
    });

    it('should return false for invalid token', async () => {
      const jwt = new Jwt('invalid-token', secret);
      expect(await jwt.isValid()).toBe(false);
    });

    it('should return false when wrong secret is used', async () => {
      const jwt = await Jwt.create(secret);
      const jwtWithWrongSecret = new Jwt(jwt.getToken(), 'wrong-secret');
      expect(await jwtWithWrongSecret.isValid()).toBe(false);
    });
  });

  describe('getters', () => {
    it('should return correct secret', async () => {
      const jwt = await Jwt.create(secret);
      expect(jwt.getSecret()).toBe(secret);
    });

    it('should return token string', async () => {
      const jwt = await Jwt.create(secret);
      expect(jwt.getToken()).toBeDefined();
      expect(typeof jwt.getToken()).toBe('string');
    });
  });

  describe('payload and header access', () => {
    it('should correctly retrieve custom data from payload', async () => {
      interface CustomData {
        customField: string;
      }

      const jwt = await Jwt.create(secret, {
        data: { customField: 'test-value' },
      });

      const payload = jwt.getPayload<CustomData>();
      expect(payload.customField).toBe('test-value');
    });

    it('should correctly retrieve header data', async () => {
      const customHeader = { kid: 'test-key-id', alg: 'HS256' };
      const jwt = await Jwt.create(secret, {
        header: customHeader,
      });

      const header = jwt.getHeader<typeof customHeader & { alg: string }>();
      expect(header.kid).toBe('test-key-id');
      expect(header.alg).toBe('HS256');
    });
  });
});
