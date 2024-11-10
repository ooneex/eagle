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
      expect(headers.get('Content-Type')).toBe('application/octet-stream');
    });

    it('should set form data content type', () => {
      const headers = new Header();
      headers.setFormDataType();
      expect(headers.get('Content-Type')).toBe('multipart/form-data');
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
});
