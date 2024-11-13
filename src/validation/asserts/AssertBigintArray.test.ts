import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { AssertBigintArray } from '@/validation/mod.ts';

describe('AssertBigintArray', () => {
  it('should create instance', () => {
    const assert = new AssertBigintArray();
    expect(assert).toBeInstanceOf(AssertBigintArray);
  });

  describe('validate', () => {
    it('should return success true for valid bigint array', () => {
      const assert = new AssertBigintArray();
      const result = assert.validate([1n, 2n, 3n]);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Value must be an array of bigints');
    });

    it('should return success false for non-array', () => {
      const assert = new AssertBigintArray();
      const result = assert.validate('not an array');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array of bigints');
    });

    it('should return success false for array with non-bigint values', () => {
      const assert = new AssertBigintArray();
      const result = assert.validate([1n, 'string', 3n]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array of bigints');
    });

    it('should return success false for empty array', () => {
      const assert = new AssertBigintArray();
      const result = assert.validate([]);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Value must be an array of bigints');
    });

    it('should return success false for null', () => {
      const assert = new AssertBigintArray();
      const result = assert.validate(null);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array of bigints');
    });
  });
});
