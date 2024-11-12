import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { ReadonlyHeader } from './ReadonlyHeader.ts';

describe('ReadonlyHeader', () => {
  const createHeader = (entries: [string, string][]) => {
    const headers = new Headers(entries);
    return new ReadonlyHeader(headers);
  };

  describe('getCharset', () => {
    it('should return charset from Content-Type header', () => {
      const header = createHeader([
        ['Content-Type', 'text/plain; charset=utf-8'],
      ]);
      expect(header.getCharset()).toBe('UTF-8');
    });

    it('should return null when no charset is specified', () => {
      const header = createHeader([
        ['Content-Type', 'text/plain'],
      ]);
      expect(header.getCharset()).toBe(null);
    });
  });

  describe('get methods', () => {
    it('should return correct values for basic headers', () => {
      const header = createHeader([
        ['Cache-Control', 'no-cache'],
        ['Etag', '"123"'],
        ['Accept', 'application/json'],
        ['Content-Length', '42'],
      ]);

      expect(header.getCacheControl()).toBe('no-cache');
      expect(header.getEtag()).toBe('"123"');
      expect(header.getAccept()).toBe('application/json');
      expect(header.getContentLength()).toBe(42);
    });

    it('should parse Accept-Encoding correctly', () => {
      const header = createHeader([
        ['Accept-Encoding', 'gzip, deflate, br'],
      ]);
      expect(header.getAcceptEncoding()).toEqual(['gzip', 'deflate', 'br']);
    });
  });

  describe('authorization methods', () => {
    it('should parse Basic auth correctly', () => {
      const header = createHeader([
        ['Authorization', 'Basic dXNlcjpwYXNz'],
      ]);
      expect(header.getBasicAuth()).toBe('dXNlcjpwYXNz');
    });

    it('should parse Bearer token correctly', () => {
      const header = createHeader([
        ['Authorization', 'Bearer xyz123'],
      ]);
      expect(header.getBearerToken()).toBe('xyz123');
    });

    it('should return null for invalid auth formats', () => {
      const header = createHeader([
        ['Authorization', 'Invalid xyz123'],
      ]);
      expect(header.getBasicAuth()).toBe(null);
      expect(header.getBearerToken()).toBe(null);
    });

    it('should get IP from X-Forwarded-For or Remote-Addr headers', () => {
      const headerWithXFF = createHeader([
        ['X-Forwarded-For', '203.0.113.195'],
      ]);
      expect(headerWithXFF.getIp()).toBe('203.0.113.195');

      const headerWithRemoteAddr = createHeader([
        ['Remote-Addr', '192.168.1.1'],
      ]);
      expect(headerWithRemoteAddr.getIp()).toBe('192.168.1.1');

      const headerWithoutIp = createHeader([]);
      expect(headerWithoutIp.getIp()).toBe(null);
    });
  });

  describe('utility methods', () => {
    it('should count headers correctly', () => {
      const header = createHeader([
        ['Content-Type', 'text/plain'],
        ['Accept', 'application/json'],
      ]);
      expect(header.count()).toBe(2);
      expect(header.hasData()).toBe(true);
    });

    it('should convert to JSON correctly', () => {
      const header = createHeader([
        ['Content-Type', 'text/plain'],
        ['Accept', 'application/json'],
      ]);
      const json = header.toJson();

      expect(json).toEqual({
        'content-type': 'text/plain',
        accept: 'application/json',
      });
    });
  });
});
