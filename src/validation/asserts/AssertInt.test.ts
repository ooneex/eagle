import { AssertInt } from '@/validation/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('AssertInt', () => {
  const assertInt = new AssertInt();

  describe('validate', () => {
    it('should return success for valid integers', () => {
      const result = assertInt.validate(5);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Value must be an integer');
    });

    it('should return failure for non-integers', () => {
      const result = assertInt.validate(5.5);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an integer');
    });

    it('should return failure for NaN', () => {
      const result = assertInt.validate(NaN);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an integer');
    });

    it('should return failure for non-number types', () => {
      const result = assertInt.validate('string');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an integer');
    });
  });
});
