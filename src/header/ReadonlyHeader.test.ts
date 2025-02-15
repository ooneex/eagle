import { describe, expect, it } from 'bun:test';
import { ReadonlyHeader } from './ReadonlyHeader';

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
      const header = createHeader([['Content-Type', 'text/plain']]);
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
      const header = createHeader([['Accept-Encoding', 'gzip, deflate, br']]);
      expect(header.getAcceptEncoding()).toEqual(['gzip', 'deflate', 'br']);
    });
  });

  describe('authorization methods', () => {
    it('should parse Basic auth correctly', () => {
      const header = createHeader([['Authorization', 'Basic dXNlcjpwYXNz']]);
      expect(header.getBasicAuth()).toBe('dXNlcjpwYXNz');
    });

    it('should parse Bearer token correctly', () => {
      const header = createHeader([['Authorization', 'Bearer xyz123']]);
      expect(header.getBearerToken()).toBe('xyz123');
    });

    it('should return null for invalid auth formats', () => {
      const header = createHeader([['Authorization', 'Invalid xyz123']]);
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

  describe('header value parsing', () => {
    it('should handle multiple values in X-Forwarded-For', () => {
      const header = createHeader([
        ['X-Forwarded-For', '203.0.113.195, 70.41.3.18, 150.172.238.178'],
      ]);
      expect(header.getIp()).toBe('203.0.113.195, 70.41.3.18, 150.172.238.178');
    });

    it('should handle empty header values', () => {
      const header = createHeader([
        ['Content-Type', ''],
        ['Authorization', ''],
      ]);
      expect(header.get('Content-Type')).toBe('');
      expect(header.getBasicAuth()).toBe(null);
      expect(header.getBearerToken()).toBe(null);
    });

    it('should handle case-insensitive header names', () => {
      const header = createHeader([
        ['content-type', 'application/json'],
        ['ACCEPT', 'text/plain'],
      ]);
      expect(header.get('Content-Type')).toBe('application/json');
      expect(header.get('Accept')).toBe('text/plain');
    });

    it('should return empty object for toJson when no headers exist', () => {
      const header = createHeader([]);
      expect(header.toJson()).toEqual({});
      expect(header.hasData()).toBe(false);
    });

    it('should handle malformed Authorization headers', () => {
      const header = createHeader([
        ['Authorization', 'Basic'],
        ['Authorization', 'Bearer'],
      ]);
      expect(header.getBasicAuth()).toBe(null);
      expect(header.getBearerToken()).toBe(null);
    });
  });

  describe('header getters', () => {
    it('should get Cache-Control header', () => {
      const header = createHeader([['Cache-Control', 'max-age=3600']]);
      expect(header.getCacheControl()).toBe('max-age=3600');
    });

    it('should get ETag header', () => {
      const header = createHeader([['Etag', 'abc123']]);
      expect(header.getEtag()).toBe('abc123');
    });

    it('should get Accept-Encoding header', () => {
      const header = createHeader([['Accept-Encoding', 'gzip, deflate, br']]);
      expect(header.getAcceptEncoding()).toEqual(['gzip', 'deflate', 'br']);
    });

    it('should get Allow header', () => {
      const header = createHeader([['Allow', 'GET, POST']]);
      expect(header.getAllow()).toEqual(['GET', 'POST']);
    });

    it('should get Content-Length as number', () => {
      const header = createHeader([['Content-Length', '1024']]);
      expect(header.getContentLength()).toBe(1024);
    });

    it('should get Content-Disposition header', () => {
      const header = createHeader([
        ['Content-Disposition', 'attachment; filename="file.txt"'],
      ]);
      expect(header.getContentDisposition()).toBe(
        'attachment; filename="file.txt"',
      );
    });

    it('should get custom X-Custom header', () => {
      const header = createHeader([['X-Custom', 'custom-value']]);
      expect(header.getCustom()).toBe('custom-value');
    });

    it('should get Cookie header', () => {
      const header = createHeader([['Cookie', 'session=123; user=john']]);
      expect(header.getCookie()).toBe('session=123; user=john');
    });

    it('should get Host header', () => {
      const header = createHeader([['Host', 'example.com']]);
      expect(header.getHost()).toBe('example.com');
    });

    it('should return null for non-existent headers', () => {
      const header = createHeader([]);
      expect(header.getCacheControl()).toBeNull();
      expect(header.getEtag()).toBeNull();
      expect(header.getAcceptEncoding()).toBeNull();
      expect(header.getAllow()).toBeNull();
      expect(header.getContentLength()).toBeNull();
      expect(header.getContentDisposition()).toBeNull();
      expect(header.getCustom()).toBeNull();
      expect(header.getCookie()).toBeNull();
      expect(header.getHost()).toBeNull();
    });
  });

  describe('getReferer', () => {
    it('should get Referer header', () => {
      const header = createHeader([['Referer', 'https://example.com']]);
      expect(header.getReferer()).toBe('https://example.com');
    });

    it('should return null when Referer header is not present', () => {
      const header = createHeader([]);
      expect(header.getReferer()).toBeNull();
    });
  });

  describe('getRefererPolicy', () => {
    it('should get Referrer-Policy header', () => {
      const header = createHeader([['Referrer-Policy', 'no-referrer']]);
      expect(header.getRefererPolicy()).toBe('no-referrer');
    });

    it('should return null when Referrer-Policy header is not present', () => {
      const header = createHeader([]);
      expect(header.getRefererPolicy()).toBeNull();
    });
  });

  describe('getServer', () => {
    it('should get Server header', () => {
      const header = createHeader([['Server', 'Apache/2.4.1']]);
      expect(header.getServer()).toBe('Apache/2.4.1');
    });

    it('should return null when Server header is not present', () => {
      const header = createHeader([]);
      expect(header.getServer()).toBeNull();
    });
  });

  describe('getUserAgent', () => {
    it('should parse User-Agent header', () => {
      const header = createHeader([
        [
          'User-Agent',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        ],
      ]);
      const ua = header.getUserAgent();
      expect(ua.browser.name).toBe('Chrome');
      expect(ua.os.name).toBe('Windows');
      expect(ua.engine.name).toBe('Blink');
    });

    it('should return empty values when User-Agent header is not present', () => {
      const header = createHeader([]);
      const ua = header.getUserAgent();
      expect(ua.browser.name).toBeUndefined();
      expect(ua.os.name).toBeUndefined();
      expect(ua.engine.name).toBeUndefined();
    });
  });

  describe('getAuthorization', () => {
    it('should get Authorization header', () => {
      const header = createHeader([['Authorization', 'Bearer token123']]);
      expect(header.getAuthorization()).toBe('Bearer token123');
    });

    it('should return null when Authorization header is not present', () => {
      const header = createHeader([]);
      expect(header.getAuthorization()).toBeNull();
    });
  });

  describe('getBasicAuth', () => {
    it('should extract Basic auth token', () => {
      const header = createHeader([['Authorization', 'Basic abc123']]);
      expect(header.getBasicAuth()).toBe('abc123');
    });

    it('should return null when Authorization header is not present', () => {
      const header = createHeader([]);
      expect(header.getBasicAuth()).toBeNull();
    });

    it('should return null when Authorization header is not Basic auth', () => {
      const header = createHeader([['Authorization', 'Bearer token123']]);
      expect(header.getBasicAuth()).toBeNull();
    });
  });

  describe('getBearerToken', () => {
    it('should extract Bearer token', () => {
      const header = createHeader([['Authorization', 'Bearer xyz789']]);
      expect(header.getBearerToken()).toBe('xyz789');
    });

    it('should return null when Authorization header is not present', () => {
      const header = createHeader([]);
      expect(header.getBearerToken()).toBeNull();
    });

    it('should return null when Authorization header is not Bearer token', () => {
      const header = createHeader([['Authorization', 'Basic abc123']]);
      expect(header.getBearerToken()).toBeNull();
    });
  });
});
