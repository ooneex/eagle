import { describe, expect, it } from 'bun:test';
import { HttpRequest } from './HttpRequest';

describe('HttpRequest', () => {
  it('should parse URL and path correctly', () => {
    const request = new HttpRequest(
      new Request('http://localhost:3000/test?foo=bar'),
    );
    expect(request.url.native.toString()).toBe(
      'http://localhost:3000/test?foo=bar',
    );
    expect(request.path).toBe('/test');
  });

  it('should parse query parameters correctly', () => {
    const request = new HttpRequest(
      new Request('http://localhost:3000/test?foo=bar&baz=123'),
    );
    expect(request.queries.get('foo')).toBe('bar');
    expect(request.queries.get('baz')).toBe(123);
  });

  it('should parse headers correctly', () => {
    const headers = new Headers({
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'X-Forwarded-For': '127.0.0.1',
      Host: 'localhost:3000',
      Referer: 'http://example.com',
      Server: 'test-server',
      Authorization: 'Bearer test-token',
    });
    const request = new HttpRequest(
      new Request('http://localhost:3000', { headers }),
    );

    expect(request.userAgent.browser.name).toBe('Chrome');
    expect(request.userAgent.browser.version).toBe('120.0.0.0');
    expect(request.userAgent.engine.name).toBe('Blink');
    expect(request.userAgent.engine.version).toBe('120.0.0.0');
    expect(request.userAgent.os.name).toBe('macOS');
    expect(request.userAgent.os.version).toBe('10.15.7');
    expect(request.userAgent.device.type).toBeUndefined();
    expect(request.userAgent.device.vendor).toBe('Apple');
    expect(request.userAgent.device.model).toBe('Macintosh');
    expect(request.userAgent.cpu.architecture).toBeUndefined();
    expect(request.ip).toBe('127.0.0.1');
    expect(request.host).toBe('localhost:3000');
    expect(request.referer).toBe('http://example.com');
    expect(request.server).toBe('test-server');
    expect(request.bearerToken).toBe('test-token');
  });

  it('should parse request parameters correctly', () => {
    const request = new HttpRequest(new Request('http://localhost:3000'), {
      params: {
        id: '123',
        name: 'test',
      },
    });
    expect(request.params.get('id')).toBe(123);
    expect(request.params.get('name')).toBe('test');
  });

  it('should parse payload correctly', () => {
    const request = new HttpRequest(new Request('http://localhost:3000'), {
      payload: {
        data: { foo: 'bar' },
      },
    });
    expect(request.payload.get('data') ?? {}).toEqual({ foo: 'bar' });
  });

  it('should parse language preferences correctly', () => {
    const headers = new Headers({
      'Accept-Language': 'en-US,en;q=0.9',
    });
    const request = new HttpRequest(
      new Request('http://localhost:3000', { headers }),
    );
    expect(request.lang?.code).toBe('en');
    expect(request.lang?.region).toBe('US');
  });

  it('should handle custom language header', () => {
    const headers = new Headers({
      'X-Custom-Lang': 'fr',
    });
    const request = new HttpRequest(
      new Request('http://localhost:3000', { headers }),
    );
    expect(request.lang?.code).toBe('fr');
    expect(request.lang?.region).toBe(null);
  });

  it('should parse form data correctly', async () => {
    const formData = new FormData();
    formData.append('field1', 'value1');
    formData.append('field2', 'value2');

    const request = new HttpRequest(new Request('http://localhost:3000'), {
      formData,
    });

    const field1 = request.form.get('field1');
    const field2 = request.form.get('field2');

    expect(field1).toBeDefined();
    expect(field1).toBe('value1');
    expect(field2).toBeDefined();
    expect(field2).toBe('value2');
  });

  it('should handle file uploads in form data', async () => {
    const formData = new FormData();
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    formData.append('file', file);

    const request = new HttpRequest(new Request('http://localhost:3000'), {
      formData,
    });

    const uploadedFile = request.files.get('file');
    expect(uploadedFile?.originalName).toBe('test.txt');
    expect(uploadedFile?.name).toBeDefined();
    expect(uploadedFile?.type).toBe('text/plain');
  });

  it('should parse ip correctly', () => {
    const request = new HttpRequest(new Request('http://localhost:3000'), {
      ip: '127.0.0.1',
    });
    expect(request.ip).toBe('127.0.0.1');
  });
});
