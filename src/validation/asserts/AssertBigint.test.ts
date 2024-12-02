import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertBigint } from '../mod.ts';

describe('AssertBigint', () => {
  const assertBigint = new AssertBigint();

  it('should return success true for bigint values', () => {
    const result = assertBigint.validate(BigInt(123));
    expect(result.success).toBe(true);
    expect(result.message).toBe('value must be a bigint');
  });

  it('should return success false for non-bigint values', () => {
    const testCases = [
      123,
      'string',
      true,
      {},
      [],
      null,
      undefined,
    ];

    for (const testCase of testCases) {
      const result = assertBigint.validate(testCase);
      expect(result.success).toBe(false);
      expect(result.message).toBe('value must be a bigint');
    }
  });
});
