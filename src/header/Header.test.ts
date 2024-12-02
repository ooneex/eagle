import { Exception } from '@/exception/mod.ts';
import { Header } from '@/header/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('Header', () => {
  describe('constructor', () => {
    it('should create empty headers when no argument provided', () => {
      const headers = new Header();
      expect(headers).toBeDefined();
    });

    it('should accept existing Headers object', () => {
      const native = new Headers();
      const headers = new Header(native);
      expect(headers).toBeDefined();
    });
  });

  describe('authorization methods', () => {
    it('should set basic authorization header', () => {
      const headers = new Header();
      headers.setBasicAuth('test-token');
      expect(headers.get('Authorization')).toBe('Basic test-token');
    });

    it('should set bearer token', () => {
      const headers = new Header();
      headers.setBearerToken('test-token');
      expect(headers.get('Authorization')).toBe('Bearer test-token');
    });

    it('should set raw authorization header', () => {
      const headers = new Header();
      headers.setAuthorization('Custom auth');
      expect(headers.get('Authorization')).toBe('Custom auth');
    });
  });

  describe('content type methods', () => {
    it('should set JSON content type with charset', () => {
      const headers = new Header();
      headers.setJsonType('UTF-8');
      expect(headers.get('Content-Type')).toBe(
        'application/json; charset=UTF-8',
      );
      expect(headers.get('Accept')).toBe('application/json');
    });

    it('should set blob content type', () => {
      const headers = new Header();
      headers.setBlobType();
      expect(headers.get('Content-Type')).toBe(
        'application/octet-stream; charset=UTF-8',
      );
    });

    it('should set form data content type', () => {
      const headers = new Header();
      headers.setFormDataType();
      expect(headers.get('Content-Type')).toBe(
        'multipart/form-data; charset=UTF-8',
      );
    });

    it('should set HTML content type with charset', () => {
      const headers = new Header();
      headers.setHtmlType('UTF-8');
      expect(headers.get('Content-Type')).toBe('text/html; charset=UTF-8');
    });
  });

  describe('content headers', () => {
    it('should set content disposition', () => {
      const headers = new Header();
      headers.contentDisposition('attachment; filename="example.txt"');
      expect(headers.get('Content-Disposition')).toBe(
        'attachment; filename="example.txt"',
      );
    });

    it('should set content length', () => {
      const headers = new Header();
      headers.contentLength(1234);
      expect(headers.get('Content-Length')).toBe('1234');
    });
  });

  describe('header manipulation', () => {
    it('should add and get custom header', () => {
      const headers = new Header();
      headers.setCustom('test-value');
      expect(headers.get('X-Custom')).toBe('test-value');
    });

    it('should delete header', () => {
      const headers = new Header();
      headers.set('X-Test', 'value');
      headers.delete('X-Test');
      expect(headers.get('X-Test')).toBeNull();
    });

    it('should set cache control', () => {
      const headers = new Header();
      headers.setCacheControl('no-cache');
      expect(headers.get('Cache-Control')).toBe('no-cache');
    });

    it('should set etag', () => {
      const headers = new Header();
      headers.setEtag('123abc');
      expect(headers.get('Etag')).toBe('123abc');
    });
  });

  describe('error handling', () => {
    it('should throw Exception when setting invalid content length', () => {
      const headers = new Header();

      try {
        headers.contentLength(-1);
      } catch (error) {
        expect(error).toBeInstanceOf(Exception);
      }
    });

    it('should throw Exception when setting empty etag', () => {
      const headers = new Header();

      try {
        headers.setEtag('');
      } catch (error) {
        expect(error).toBeInstanceOf(Exception);
      }
    });
  });

  describe('header existence checks', () => {
    it('should check if header exists', () => {
      const headers = new Header();
      headers.set('X-Test', 'value');
      expect(headers.has('X-Test')).toBe(true);
      expect(headers.has('Non-Existent')).toBe(false);
    });

    it('should return all headers', () => {
      const headers = new Header();
      headers.set('X-Test-1', 'value1');
      headers.set('X-Test-2', 'value2');

      expect(headers.get('X-Test-1')).toBe('value1');
      expect(headers.get('X-Test-2')).toBe('value2');
    });
  });

  describe('content type handling', () => {
    it('should set JSON content type without charset', () => {
      const headers = new Header();
      headers.setJsonType();
      expect(headers.get('Content-Type')).toBe(
        'application/json; charset=UTF-8',
      );
    });

    it('should set text content type with charset', () => {
      const headers = new Header();
      headers.setTextType('UTF-16');
      expect(headers.get('Content-Type')).toBe('text/plain; charset=UTF-16');
    });
  });
});
