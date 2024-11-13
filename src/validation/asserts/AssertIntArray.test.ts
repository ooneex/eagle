import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertIntArray } from '@/validation/mod.ts';

describe('AssertIntArray', () => {
  const assertIntArray = new AssertIntArray();

  describe('validate', () => {
    it('should return success false if value is not an array', () => {
      const result = assertIntArray.validate('not an array');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array');
    });

    it('should return success true for array of integers', () => {
      const result = assertIntArray.validate([1, 2, 3, 4, 5]);
      expect(result.success).toBe(true);
    });

    it('should return success false for array with non-integers', () => {
      const result = assertIntArray.validate([1, 2.5, 3]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('All array values must be integers');
    });

    it('should return success false for array with NaN', () => {
      const result = assertIntArray.validate([1, Number.NaN, 3]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('All array values must be integers');
    });

    it('should return success false for array with Infinity', () => {
      const result = assertIntArray.validate([1, Number.POSITIVE_INFINITY, 3]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('All array values must be integers');
    });

    it('should return success false for array with non-numbers', () => {
      const result = assertIntArray.validate([1, '2', 3]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('All array values must be integers');
    });

    it('should return success true for empty array', () => {
      const result = assertIntArray.validate([]);
      expect(result.success).toBe(true);
    });

    it('should return success true for array with negative integers', () => {
      const result = assertIntArray.validate([-1, -2, -3]);
      expect(result.success).toBe(true);
    });
  });
});
