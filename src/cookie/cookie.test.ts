import { describe, expect, it, spyOn } from 'bun:test';
import type { CookieType } from '@/cookie';
import {
  deleteCookie,
  getCookies,
  getSetCookies,
  parseSetCookie,
  setCookie,
} from '@/cookie';

describe('Cookie', () => {
  describe('getCookies', () => {
    it('should parse cookies from header', () => {
      const headers = new Headers();
      headers.set('Cookie', 'foo=bar; baz=qux');

      const cookies = getCookies(headers);

      expect(cookies).toEqual({
        foo: 'bar',
        baz: 'qux',
      });
    });

    it('should return empty object when no cookies', () => {
      const headers = new Headers();
      const cookies = getCookies(headers);
      expect(cookies).toEqual({});
    });
  });

  describe('setCookie', () => {
    it('should set cookie header', () => {
      const headers = new Headers();
      const cookie: CookieType = {
        name: 'foo',
        value: 'bar',
        secure: true,
        httpOnly: true,
        path: '/',
      };

      setCookie(headers, cookie);

      expect(headers.get('Set-Cookie')).toBe(
        'foo=bar; Secure; HttpOnly; Path=/',
      );
    });

    it('should handle __Secure prefix', () => {
      const headers = new Headers();
      const cookie: CookieType = {
        name: '__Secure-foo',
        value: 'bar',
      };

      setCookie(headers, cookie);

      expect(headers.get('Set-Cookie')).toBe('__Secure-foo=bar; Secure');
    });

    it('should handle __Host prefix', () => {
      const headers = new Headers();
      const cookie: CookieType = {
        name: '__Host-foo',
        value: 'bar',
      };

      setCookie(headers, cookie);

      expect(headers.get('Set-Cookie')).toBe('__Host-foo=bar; Secure; Path=/');
    });
  });

  describe('deleteCookie', () => {
    it('should set cookie with expired date', () => {
      const headers = new Headers();

      deleteCookie(headers, 'foo');

      const setCookieHeader = headers.get('Set-Cookie');
      expect(setCookieHeader).toContain('foo=');
      expect(setCookieHeader).toContain(
        'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      );
    });

    it('should include provided attributes', () => {
      const headers = new Headers();

      deleteCookie(headers, 'foo', {
        path: '/',
        secure: true,
      });

      const setCookieHeader = headers.get('Set-Cookie');
      expect(setCookieHeader).toContain('Path=/');
      expect(setCookieHeader).toContain('Secure');
    });
  });

  describe('getSetCookies', () => {
    it('should parse multiple set-cookie headers', () => {
      const headers = new Headers();
      headers.append('Set-Cookie', 'foo=bar; Secure');
      headers.append('Set-Cookie', 'baz=qux; HttpOnly');

      const cookies = getSetCookies(headers);

      expect(cookies).toEqual([
        {
          name: 'foo',
          value: 'bar',
          secure: true,
        },
        {
          name: 'baz',
          value: 'qux',
          httpOnly: true,
        },
      ]);
    });

    it('should ignore invalid cookies', () => {
      const headers = new Headers();
      headers.append('Set-Cookie', '__Secure-foo=bar'); // Missing secure flag
      headers.append('Set-Cookie', 'valid=cookie');

      const cookies = getSetCookies(headers);

      expect(cookies).toEqual([
        {
          name: 'valid',
          value: 'cookie',
        },
      ]);
    });
  });

  describe('parseSetCookie', () => {
    it('should parse cookie name and value', () => {
      const cookie = parseSetCookie('foo=bar');
      expect(cookie).toEqual({
        name: 'foo',
        value: 'bar',
      });
    });

    it('should parse cookie attributes', () => {
      const cookie = parseSetCookie(
        'foo=bar; Path=/; Domain=example.com; Secure; HttpOnly; SameSite=Strict',
      );
      expect(cookie).toEqual({
        name: 'foo',
        value: 'bar',
        path: '/',
        domain: 'example.com',
        secure: true,
        httpOnly: true,
        sameSite: 'Strict',
      });
    });

    it('should handle expires attribute', () => {
      const expires = `${new Date().toUTCString()}`;
      const cookie = parseSetCookie(`foo=bar; Expires=${expires}`);
      expect(cookie).toEqual({
        name: 'foo',
        value: 'bar',
        expires: new Date(expires),
      });
    });

    it('should handle max-age attribute', () => {
      const cookie = parseSetCookie('foo=bar; Max-Age=3600');
      expect(cookie).toEqual({
        name: 'foo',
        value: 'bar',
        maxAge: 3600,
      });
    });

    it('should store unparsed attributes', () => {
      const cookie = parseSetCookie('foo=bar; Unknown=Value');
      expect(cookie).toEqual({
        name: 'foo',
        value: 'bar',
        unparsed: ['Unknown=Value'],
      });
    });

    it('should validate __Secure- prefix requirements', () => {
      const spy = spyOn(console, 'warn');

      const cookie = parseSetCookie('__Secure-foo=bar');
      expect(cookie).toBeNull();
      expect(spy).toHaveBeenCalledWith(
        'Cookies with names starting with `__Secure-` must be set with the secure flag. Cookie ignored.',
      );
    });

    it('should validate __Host- prefix requirements', () => {
      const spy = spyOn(console, 'warn');

      let cookie = parseSetCookie('__Host-foo=bar');
      expect(cookie).toBeNull();
      expect(spy).toHaveBeenCalledWith(
        'Cookies with names starting with `__Host-` must be set with the secure flag. Cookie ignored.',
      );

      cookie = parseSetCookie('__Host-foo=bar; Secure; Domain=example.com');
      expect(cookie).toBeNull();
      expect(spy).toHaveBeenCalledWith(
        'Cookies with names starting with `__Host-` must not have a domain specified. Cookie ignored.',
      );

      cookie = parseSetCookie('__Host-foo=bar; Secure; Path=/sub');
      expect(cookie).toBeNull();
      expect(spy).toHaveBeenCalledWith(
        'Cookies with names starting with `__Host-` must have path be `/`. Cookie has been ignored.',
      );
    });
  });

  describe('getSetCookies', () => {
    it('should get all set-cookie headers', () => {
      const headers = new Headers();
      headers.append('Set-Cookie', 'foo=bar');
      headers.append('Set-Cookie', 'baz=qux; Secure');

      const cookies = getSetCookies(headers);
      expect(cookies).toEqual([
        { name: 'foo', value: 'bar' },
        { name: 'baz', value: 'qux', secure: true },
      ]);
    });
  });

  describe('getCookies', () => {
    it('should parse cookie header', () => {
      const headers = new Headers();
      headers.set('Cookie', 'foo=bar; baz=qux');

      const cookies = getCookies(headers);
      expect(cookies).toEqual({
        foo: 'bar',
        baz: 'qux',
      });
    });

    it('should return empty object if no cookie header', () => {
      const headers = new Headers();
      const cookies = getCookies(headers);
      expect(cookies).toEqual({});
    });

    it('should throw if cookie starts with =', () => {
      const headers = new Headers();
      headers.set('Cookie', '=foo');

      expect(() => getCookies(headers)).toThrow("Cookie cannot start with '='");
    });
  });

  describe('setCookie', () => {
    it('should set cookie header', () => {
      const headers = new Headers();
      setCookie(headers, {
        name: 'foo',
        value: 'bar',
        secure: true,
      });

      expect(headers.get('Set-Cookie')).toBe('foo=bar; Secure');
    });
  });

  describe('deleteCookie', () => {
    it('should set cookie with expires in past', () => {
      const headers = new Headers();
      deleteCookie(headers, 'foo');

      const cookies = getSetCookies(headers);
      expect((cookies[0].expires as Date).getTime()).toBe(0);
      expect(cookies[0].value).toBe('');
    });

    it('should include provided attributes', () => {
      const headers = new Headers();
      deleteCookie(headers, 'foo', {
        path: '/test',
        secure: true,
      });

      expect(headers.get('Set-Cookie')).toBe(
        'foo=; Secure; Path=/test; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      );
    });
  });
});
