import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertFunctionArray } from '@/validation/mod.ts';

describe('AssertFunctionArray', () => {
  const assertFunctionArray = new AssertFunctionArray();

  describe('validate', () => {
    it('should return false for non-array values', () => {
      const result = assertFunctionArray.validate('not an array');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array');
    });

    it('should return true for empty array', () => {
      const result = assertFunctionArray.validate([]);
      expect(result.success).toBe(true);
      expect(result.message).toBe('');
    });

    it('should return true for array of functions', () => {
      // biome-ignore lint/complexity/useArrowFunction: <explanation>
      const functions = [() => {}, function () {}, async () => {}];
      const result = assertFunctionArray.validate(functions);
      expect(result.success).toBe(true);
      expect(result.message).toBe('');
    });

    it('should return false for array with non-function elements', () => {
      const mixedArray = [() => {}, 'string', 123];
      const result = assertFunctionArray.validate(mixedArray);
      expect(result.success).toBe(false);
      expect(result.message).toBe('All array elements must be functions');
    });

    it('should return false for array of non-functions', () => {
      const nonFunctions = ['string', 123, true, {}];
      const result = assertFunctionArray.validate(nonFunctions);
      expect(result.success).toBe(false);
      expect(result.message).toBe('All array elements must be functions');
    });
  });
});
