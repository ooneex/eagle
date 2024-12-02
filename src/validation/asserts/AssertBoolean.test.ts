import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertBoolean } from '../mod.ts';

describe('AssertBoolean', () => {
  const assertBoolean = new AssertBoolean();

  it('should validate true as boolean', () => {
    const result = assertBoolean.validate(true);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be a boolean');
  });

  it('should validate false as boolean', () => {
    const result = assertBoolean.validate(false);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be a boolean');
  });

  it('should reject non-boolean values', () => {
    const invalidValues = [
      1,
      'true',
      null,
      undefined,
      {},
      [],
      0,
      '',
    ];

    for (const value of invalidValues) {
      const result = assertBoolean.validate(value);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be a boolean');
    }
  });
});
