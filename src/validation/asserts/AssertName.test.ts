import { AssertName } from '@/validation/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('AssertName', () => {
  const assertName = new AssertName();

  it('should validate correct names', () => {
    const validNames = [
      'John',
      'Alice',
    ];

    for (const name of validNames) {
      const result = assertName.validate(name);
      expect(result).toEqual({
        success: true,
        message: 'Value must be a valid name',
      });
    }
  });

  it('should reject invalid names', () => {
    const invalidNames = [
      '', // empty string
      '123John', // starts with number
      '@John', // starts with special character
      ' John', // starts with space
      null, // null value
      undefined, // undefined value
      42, // number
      {}, // object
    ];

    for (const name of invalidNames) {
      const result = assertName.validate(name);
      expect(result.success).toBe(false);
    }
  });

  it('should handle non-string inputs via AssertString', () => {
    const result = assertName.validate(123);
    expect(result).toEqual({
      success: false,
      message: 'Value must be a string',
    });
  });
});
