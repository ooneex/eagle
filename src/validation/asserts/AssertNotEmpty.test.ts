import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertNotEmpty } from '@/validation/mod.ts';

describe('AssertNotEmpty', () => {
  const assertNotEmpty = new AssertNotEmpty();

  it('should validate non-empty strings', () => {
    const validStrings = [
      'hello',
      'world',
      '  trimmed  ',
      '!@#$', // special characters are fine
      '123', // numbers are fine
    ];

    for (const str of validStrings) {
      const result = assertNotEmpty.validate(str);
      expect(result).toEqual({
        success: true,
        message: 'Value must not be empty',
      });
    }
  });

  it('should reject empty strings', () => {
    const invalidStrings = [
      '', // empty string
      '   ', // only whitespace
      '\t', // tab character
      '\n', // newline
      null, // null value
      undefined, // undefined value
      42, // number
      {}, // object
      [], // array
    ];

    for (const str of invalidStrings) {
      const result = assertNotEmpty.validate(str);
      expect(result.success).toBe(false);
    }
  });

  it('should handle non-string inputs via AssertString', () => {
    const result = assertNotEmpty.validate(123);
    expect(result).toEqual({
      success: false,
      message: 'Value must be a string',
    });
  });
});
