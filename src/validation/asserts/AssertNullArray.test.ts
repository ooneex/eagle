import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertNullArray } from '@/validation/mod.ts';

describe('AssertNullArray', () => {
  const assertNullArray = new AssertNullArray();

  describe('validate', () => {
    it('should return success true for array with only null values', () => {
      const result = assertNullArray.validate([null, null, null]);
      expect(result.success).toBe(true);
      expect(result.message).toBe(
        'Value must be an array containing only null values',
      );
    });

    it('should return success false for array with non-null values', () => {
      const result = assertNullArray.validate([null, 'test', null]);
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'Value must be an array containing only null values',
      );
    });

    it('should return success false for empty array', () => {
      const result = assertNullArray.validate([]);
      expect(result.success).toBe(true);
      expect(result.message).toBe(
        'Value must be an array containing only null values',
      );
    });

    it('should return success false for non-array value', () => {
      const result = assertNullArray.validate('not an array');
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'Value must be an array containing only null values',
      );
    });

    it('should return success false for null', () => {
      const result = assertNullArray.validate(null);
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'Value must be an array containing only null values',
      );
    });
  });
});
