import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertNotNull } from '../mod.ts';

describe('AssertNotNull', () => {
  const assertNotNull = new AssertNotNull();

  it('should return success true when value is not null', () => {
    const result = assertNotNull.validate('some value');
    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must not be null');
  });

  it('should return success false when value is null', () => {
    const result = assertNotNull.validate(null);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must not be null');
  });

  it('should return success true for other falsy values', () => {
    const falsyValues = [0, '', false, undefined];

    for (const value of falsyValues) {
      const result = assertNotNull.validate(value);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Value must not be null');
    }
  });
});
