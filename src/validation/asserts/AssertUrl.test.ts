import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertUrl } from '../mod.ts';

describe('AssertUrl', () => {
  const assertUrl = new AssertUrl();

  describe('validate', () => {
    it('should return success for valid URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://localhost:3000',
        'https://sub.domain.com/path?query=123#hash',
        'ftp://files.example.com',
        'ws://websocket.example.com',
      ];

      validUrls.forEach((url) => {
        const result = assertUrl.validate(url);
        expect(result.success).toBe(true);
        expect(result.message).toBe('Value is a valid URL');
      });
    });

    it('should return failure for invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'http:/missing-slashes.com',
        'https://',
        'just.text',
        ' ',
      ];

      invalidUrls.forEach((url) => {
        const result = assertUrl.validate(url);
        expect(result.success).toBe(false);
        expect(result.message).toBe('Value must be a valid URL');
      });
    });

    it('should return failure for non-string values', () => {
      const nonStringValues = [
        123,
        true,
        {},
        [],
        null,
        undefined,
      ];

      nonStringValues.forEach((value) => {
        const result = assertUrl.validate(value);
        expect(result.success).toBe(false);
        expect(result.message).toBe('Value must be a string');
      });
    });
  });
});
