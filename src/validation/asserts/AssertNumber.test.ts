import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertNumber } from '../mod.ts';

describe('AssertNumber', () => {
  const assertNumber = new AssertNumber();

  it('should validate number values', () => {
    const result = assertNumber.validate(123);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be a number');
  });

  it('should validate numeric strings', () => {
    const result = assertNumber.validate('456');
    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be a number');
  });

  it('should reject non-numeric values', () => {
    const result = assertNumber.validate('abc');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must be a number');
  });

  it('should reject null values', () => {
    const result = assertNumber.validate(null);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must be a number');
  });

  it('should reject undefined values', () => {
    const result = assertNumber.validate(undefined);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must be a number');
  });
});
