import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertNotNullArray } from '@/validation/mod.ts';

describe('AssertNotNullArray', () => {
  const assertNotNullArray = new AssertNotNullArray();

  describe('validate()', () => {
    it('should return false when value is not an array', () => {
      const result = assertNotNullArray.validate('not an array');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array');
    });

    it('should return true for array with no null values', () => {
      const result = assertNotNullArray.validate([1, 2, 'test']);
      expect(result.success).toBe(true);
    });

    it('should return false for array containing null', () => {
      const result = assertNotNullArray.validate([1, null, 3]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Array must not contain null values');
    });

    it('should return true for empty array', () => {
      const result = assertNotNullArray.validate([]);
      expect(result.success).toBe(true);
    });

    it('should return true for array with undefined values', () => {
      const result = assertNotNullArray.validate([undefined, 1, undefined]);
      expect(result.success).toBe(true);
    });
  });
});
