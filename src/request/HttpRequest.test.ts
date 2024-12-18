import { EnvConfig } from '@/config/mod.ts';
import { Jwt } from '@/jwt/mod.ts';
import { HttpRequest } from '@/request/mod.ts';
import { expect } from '@std/expect';
import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';

describe('HttpRequest', () => {
  beforeEach(() => {
    Deno.env.set(EnvConfig.KEYS.jwt.secret, 'secret123');
  });

  afterEach(() => {
    Deno.env.delete(EnvConfig.KEYS.jwt.secret);
  });

  it('should create a request with basic properties', () => {
    const headers = new Headers({
      'User-Agent': 'Mozilla/5.0',
      'X-Forwarded-For': '127.0.0.1',
      'Host': 'example.com',
      'Referer': 'https://referrer.com',
      'Server': 'test-server',
      'Authorization': 'Bearer token123',
    });

    const request = new Request('https://example.com/path?query=123', {
      method: 'POST',
      headers,
    });

    const httpRequest = new HttpRequest(request, {
      params: { id: '123' },
      payload: { name: 'test' },
    });

    expect(httpRequest.url.native.toString()).toBe(
      'https://example.com/path?query=123',
    );
    expect(httpRequest.method).toBe('POST');
    expect(httpRequest.userAgent.toString()).toBe('Mozilla/5.0');
    expect(httpRequest.ip).toBe('127.0.0.1');
    expect(httpRequest.host).toBe('example.com');
    expect(httpRequest.referer).toBe('https://referrer.com');
    expect(httpRequest.server).toBe('test-server');
    expect(httpRequest.bearerToken).toBe('token123');

    // Test params and payload
    expect(httpRequest.params.get('id')).toBe(123);
    expect(httpRequest.payload.get('name')).toBe('test');
  });

  it('should handle XMLHttpRequest detection', () => {
    const headers = new Headers({
      'X-Requested-With': 'XMLHttpRequest',
    });

    const request = new Request('https://example.com', {
      headers,
    });

    const httpRequest = new HttpRequest(request);
    expect(httpRequest.isXMLHttpRequest()).toBe(true);
  });

  it('should handle missing optional properties', () => {
    const request = new Request('https://example.com');
    const httpRequest = new HttpRequest(request);

    expect(httpRequest.ip).toBe(null);
    expect(httpRequest.host).toBe(null);
    expect(httpRequest.referer).toBe(null);
    expect(httpRequest.server).toBe(null);
    expect(httpRequest.bearerToken).toBe(null);
    expect(httpRequest.params.count()).toBe(0);
    expect(httpRequest.payload.count()).toBe(0);
  });

  it('should handle IP fallback to remote-addr', () => {
    const headers = new Headers({
      'remote-addr': '192.168.1.1',
    });

    const request = new Request('https://example.com', {
      headers,
    });

    const httpRequest = new HttpRequest(request);
    expect(httpRequest.ip).toBe('192.168.1.1');
  });

  it('should handle cookies', () => {
    const headers = new Headers([
      ['Set-Cookie', 'lulu=meow; Secure; Max-Age=3600'],
      ['Set-Cookie', 'booya=kasha; HttpOnly; Path=/'],
    ]);

    const request = new Request('https://example.com', {
      headers,
    });

    const httpRequest = new HttpRequest(request);
    expect(httpRequest.cookies.count()).toBe(2);

    const sessionCookie = httpRequest.cookies.get('lulu');
    expect(sessionCookie?.value).toBe('meow');

    const themeCookie = httpRequest.cookies.get('booya');
    expect(themeCookie?.value).toBe('kasha');
  });

  it('should handle request with no cookies', () => {
    const request = new Request('https://example.com');
    const httpRequest = new HttpRequest(request);

    expect(httpRequest.cookies.count()).toBe(0);
  });

  it('should handle JWT', () => {
    const request = new Request('https://example.com', {
      headers: new Headers({ 'Authorization': 'Bearer token123' }),
    });

    const httpRequest = new HttpRequest(request);
    expect(httpRequest.jwt?.getToken()).toBe('token123');
  });

  it('should handle JWT with no secret', () => {
    const request = new Request('https://example.com', {
      headers: new Headers({ 'Authorization': 'Bearer token123' }),
    });

    Deno.env.delete(EnvConfig.KEYS.jwt.secret);
    const httpRequest = new HttpRequest(request);
    expect(httpRequest.jwt?.getSecret()).toBe(null);
    expect(httpRequest.jwt).toBeInstanceOf(Jwt);
  });

  it('should handle JWT with no token', () => {
    const request = new Request('https://example.com');

    const httpRequest = new HttpRequest(request);
    expect(httpRequest.jwt).toBe(null);
  });

  it('should handle language', () => {
    const request = new Request('https://example.com', {
      headers: new Headers({ 'Accept-Language': 'en-GB,en;q=0.8' }),
    });

    const httpRequest = new HttpRequest(request);
    expect(httpRequest.lang?.code).toBe('en');
    expect(httpRequest.lang?.region).toBe('GB');
  });

  it('should handle language with no region', () => {
    const request = new Request('https://example.com', {
      headers: new Headers({ 'Accept-Language': 'en;q=0.8' }),
    });

    const httpRequest = new HttpRequest(request);
    expect(httpRequest.lang?.code).toBe('en');
    expect(httpRequest.lang?.region).toBe(null);
  });
});
