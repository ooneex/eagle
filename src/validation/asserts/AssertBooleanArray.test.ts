import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { AssertBooleanArray } from '@/validation/mod.ts';

describe('AssertBooleanArray', () => {
  describe('validate', () => {
    const assert = new AssertBooleanArray();

    it('should return success true for array of booleans', () => {
      const result = assert.validate([true, false, true]);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Value must be an array of booleans');
    });

    it('should return success false for array with non-boolean values', () => {
      const result = assert.validate([true, 'false', 1]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array of booleans');
    });

    it('should return success false for non-array value', () => {
      const result = assert.validate('not an array');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array of booleans');
    });

    it('should return success false for null', () => {
      const result = assert.validate(null);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array of booleans');
    });

    it('should return success false for undefined', () => {
      const result = assert.validate(undefined);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array of booleans');
    });

    it('should return success true for empty array', () => {
      const result = assert.validate([]);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Value must be an array of booleans');
    });
  });
});
