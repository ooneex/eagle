import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { AssertDateArray } from '@/validation/mod.ts';

describe('AssertDateArray', () => {
  const assertDateArray = new AssertDateArray();

  describe('assert', () => {
    it('should return true for valid array of dates', () => {
      const dates = [new Date(), new Date('2024-01-01')];
      expect(assertDateArray.validate(dates).success).toBe(true);
    });

    it('should return false for array with non-date values', () => {
      const invalidDates = [new Date(), 'not a date', 123];
      expect(assertDateArray.validate(invalidDates).success).toBe(false);
    });

    it('should return false for non-array input', () => {
      expect(assertDateArray.validate('not an array').success).toBe(false);
      expect(assertDateArray.validate(123).success).toBe(false);
      expect(assertDateArray.validate({}).success).toBe(false);
    });

    it('should return false for null input', () => {
      expect(assertDateArray.validate(null).success).toBe(false);
    });

    it('should return false for undefined input', () => {
      expect(assertDateArray.validate(undefined).success).toBe(false);
    });

    it('should return true for empty array', () => {
      expect(assertDateArray.validate([]).success).toBe(true);
    });
  });
});
