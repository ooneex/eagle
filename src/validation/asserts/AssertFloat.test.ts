import { AssertFloat } from '@/validation/asserts/AssertFloat.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('AssertFloat', () => {
  const assertFloat = new AssertFloat('Test Property');

  describe('validate', () => {
    it('should return success for valid float', () => {
      const result = assertFloat.validate(3.14);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Test Property must be a float');
    });

    it('should return failure for a valid integer', () => {
      const result = assertFloat.validate(5);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Test Property must be a float');
    });

    it('should return failure for invalid float', () => {
      const result = assertFloat.validate('not a float');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Test Property must be a float');
    });

    it('should return failure for null value', () => {
      const result = assertFloat.validate(null);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Test Property must be a float');
    });

    it('should return failure for NaN', () => {
      const result = assertFloat.validate(NaN);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Test Property must be a float');
    });

    it('should return failure for an object', () => {
      const result = assertFloat.validate({});
      expect(result.success).toBe(false);
      expect(result.message).toBe('Test Property must be a float');
    });

    it('should return failure for an array', () => {
      const result = assertFloat.validate([]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Test Property must be a float');
    });
  });
});
