import { describe, expect, it } from 'bun:test';
import { HttpRequest } from '@/request';
import { HttpResponse } from '@/response/HttpResponse.ts';

describe('HttpResponse', () => {
  describe('json', () => {
    it('should set json response data and headers', () => {
      const response = new HttpResponse();
      const data = { foo: 'bar' };

      response.json(data);

      expect(response.getData()).toEqual(data);
      expect(response.header.get('Accept')).toBe('application/json');
      expect(response.header.get('Content-Type')).toBe(
        'application/json; charset=UTF-8',
      );
    });

    it('should allow custom status and charset', () => {
      const response = new HttpResponse();

      response.json({ foo: 'bar' }, 201, 'US-ASCII');

      expect(response.isSuccessful()).toBe(true);
      expect(response.header.get('Content-Type')).toBe(
        'application/json; charset=US-ASCII',
      );
    });
  });

  describe('stream', () => {
    it('should handle string data', () => {
      const response = new HttpResponse();

      response.stream('test data');

      const data = response.getData();
      expect(data).toBeInstanceOf(ReadableStream);
    });

    it('should handle ReadableStream data', () => {
      const response = new HttpResponse();
      const stream = new ReadableStream();

      response.stream(stream);

      expect(response.getData()).toBe(stream);
    });
  });

  describe('exception', () => {
    it('should set error response', async () => {
      const response = new HttpResponse();
      const errorData = { code: 'ERROR_CODE' };

      response.exception('Error message', errorData, 400);

      const result = response.build();
      const body = JSON.parse(await result.text());

      expect(body.message).toBe('Error message');
      expect(body.data).toEqual(errorData);
      expect(body.state.status).toBe(400);
      expect(body.state.success).toBe(false);
    });
  });

  describe('notFound', () => {
    it('should set not found response', () => {
      const response = new HttpResponse();

      response.notFound('Resource not found');

      expect(response.isClientError()).toBe(true);
      expect(response.isError()).toBe(true);
    });
  });

  describe('redirect', () => {
    it('should create redirect response', () => {
      const response = new HttpResponse();
      const redirectUrl = 'https://example.com';

      const result = response.redirect(redirectUrl);

      expect(result.status).toBe(307);
      expect(result.headers.get('Location')).toBe(redirectUrl);
    });
  });

  describe('cookies', () => {
    it('should set cookies in response', () => {
      const response = new HttpResponse();

      response.cookies.add({
        name: 'test',
        value: 'value',
        secure: true,
      });

      const result = response.build();
      expect(result.headers.get('Set-Cookie')).toContain('test=value');
      expect(result.headers.get('Set-Cookie')).toContain('Secure');
    });
  });

  describe('build', () => {
    it('should build json response with request context', async () => {
      const response = new HttpResponse();
      const request = new HttpRequest(
        new Request('http://localhost/test', {
          method: 'POST',
          headers: {
            'Accept-Language': 'en',
          },
        }),
      );

      response.json({ foo: 'bar' });
      const result = response.build(request);
      const body = JSON.parse(await result.text());

      expect(body.method).toBe('POST');
      expect(body.path).toBe('/test');
      expect(body.lang).toEqual({
        code: 'en',
        region: null,
      });
      expect(body.data).toEqual({ foo: 'bar' });
    });
  });

  describe('isInformational', () => {
    it('should return true for informational status codes', () => {
      const response = new HttpResponse();
      response.json({}, 100);
      expect(response.isInformational()).toBe(true);
    });

    it('should return false for non-informational status codes', () => {
      const response = new HttpResponse();
      response.json({}, 200);
      expect(response.isInformational()).toBe(false);
    });
  });

  describe('isRedirect', () => {
    it('should return true for redirect status codes', () => {
      const response = new HttpResponse();
      response.json({}, 301);
      expect(response.isRedirect()).toBe(true);
    });

    it('should return false for non-redirect status codes', () => {
      const response = new HttpResponse();
      response.json({}, 200);
      expect(response.isRedirect()).toBe(false);
    });
  });
});
