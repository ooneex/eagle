import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertUndefinedArray } from '@/validation/mod.ts';

describe('AssertUndefinedArray', () => {
  const assertUndefinedArray = new AssertUndefinedArray();

  describe('validate', () => {
    it('should return false if value is not an array', () => {
      const result = assertUndefinedArray.validate('not an array');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array');
    });

    it('should return true if array contains only undefined values', () => {
      const result = assertUndefinedArray.validate([undefined, undefined]);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Array must contain only undefined values');
    });

    it('should return false if array contains non-undefined values', () => {
      const result = assertUndefinedArray.validate([undefined, null]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Array must contain only undefined values');
    });

    it('should return true for empty array', () => {
      const result = assertUndefinedArray.validate([]);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Array must contain only undefined values');
    });

    it('should return false for array with mixed values', () => {
      const result = assertUndefinedArray.validate([
        undefined,
        1,
        'string',
        undefined,
      ]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Array must contain only undefined values');
    });
  });
});
