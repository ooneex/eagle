import { AssertDate } from '@/validation/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('AssertFloat', () => {
  const assertDate = new AssertDate();

  describe('validate', () => {
    it('should return success for a valid date', () => {
      const result = assertDate.validate(new Date());
      expect(result.success).toBe(true);
      expect(result.message).toBe('Value must be a Date');
    });

    it('should return failure for an invalid date', () => {
      const result = assertDate.validate('not a date');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be a Date');
    });

    it('should return failure for null value', () => {
      const result = assertDate.validate(null);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be a Date');
    });

    it('should return failure for NaN', () => {
      const result = assertDate.validate(NaN);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be a Date');
    });

    it('should return failure for an object', () => {
      const result = assertDate.validate({});
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be a Date');
    });

    it('should return failure for an array', () => {
      const result = assertDate.validate([]);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be a Date');
    });
  });
});
