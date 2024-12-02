import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertArray } from '../mod.ts';

describe('AssertArray', () => {
  const assertArray = new AssertArray();

  it('should validate arrays successfully', () => {
    const result = assertArray.validate([1, 2, 3]);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be an array');
  });

  it('should fail validation for non-array values', () => {
    const testCases = [
      123,
      'string',
      { key: 'value' },
      null,
      undefined,
      true,
    ];

    testCases.forEach((testCase) => {
      const result = assertArray.validate(testCase);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be an array');
    });
  });
});
