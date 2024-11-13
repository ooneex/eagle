import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertFloatArray } from '@/validation/mod.ts';

describe('AssertFloatArray', () => {
  const assertFloatArray = new AssertFloatArray();

  describe('validate', () => {
    it('should return success for array of float values', () => {
      const result = assertFloatArray.validate([1.5, 2.7, 3.14]);
      expect(result.success).toBe(true);
      expect(result.message).toBe('');
    });

    it('should return failure for non-array input', () => {
      const result = assertFloatArray.validate('not an array');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array');
    });

    it('should return failure for array containing non-float values', () => {
      const result = assertFloatArray.validate([1.5, 2, 3.14]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must contain only float values');
    });

    it('should return failure for array containing NaN', () => {
      const result = assertFloatArray.validate([1.5, NaN, 3.14]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must contain only float values');
    });

    it('should return failure for array containing Infinity', () => {
      const result = assertFloatArray.validate([1.5, Infinity, 3.14]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must contain only float values');
    });

    it('should return failure for array containing non-number values', () => {
      const result = assertFloatArray.validate([1.5, 'string', 3.14]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must contain only float values');
    });

    it('should return failure for empty array', () => {
      const result = assertFloatArray.validate([]);
      expect(result.success).toBe(true);
      expect(result.message).toBe('');
    });

    it('should return failure for array containing integer values', () => {
      const result = assertFloatArray.validate([1.0, 2.0, 3.0]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must contain only float values');
    });

    it('should return failure for array containing mixed valid and invalid values', () => {
      const result = assertFloatArray.validate([1.5, null, 3.14]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must contain only float values');
    });
  });
});
