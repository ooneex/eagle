import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertString } from '../mod.ts';

describe('AssertString', () => {
  const assertString = new AssertString();

  it('should validate string values successfully', () => {
    const result = assertString.validate('hello');
    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be a string');
  });

  it('should fail validation for non-string values', () => {
    const testCases = [
      123,
      true,
      {},
      [],
      null,
      undefined,
    ];

    testCases.forEach((testCase) => {
      const result = assertString.validate(testCase);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be a string');
    });
  });
});
