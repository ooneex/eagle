import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertFunction } from '@/validation/mod.ts';

describe('AssertFunction', () => {
  const assertFunction = new AssertFunction();

  it('should return success true when value is a function', () => {
    const result = assertFunction.validate(() => {});
    expect(result.success).toBe(true);
  });

  it('should return success false when value is not a function', () => {
    const result = assertFunction.validate('not a function');
    expect(result.success).toBe(false);
  });

  it('should return correct error message when validation fails', () => {
    const result = assertFunction.validate('not a function');
    expect(result.message).toBe('Value must be an array');
  });

  it('should handle null/undefined inputs', () => {
    expect(assertFunction.validate(null).success).toBe(false);
    expect(assertFunction.validate(undefined).success).toBe(false);
  });

  it('should handle various non-function inputs', () => {
    expect(assertFunction.validate({}).success).toBe(false);
    expect(assertFunction.validate([]).success).toBe(false);
    expect(assertFunction.validate(123).success).toBe(false);
    expect(assertFunction.validate(true).success).toBe(false);
  });
});
