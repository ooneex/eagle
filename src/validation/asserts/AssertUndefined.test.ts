import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertUndefined } from '../mod.ts';

describe('AssertUndefined', () => {
  const assertUndefined = new AssertUndefined();

  it('should return success true when value is undefined', () => {
    const result = assertUndefined.validate(undefined);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be undefined');
  });

  it('should return success false when value is not undefined', () => {
    const testCases = [null, 0, '', false, {}, [], 'test', 42];

    for (const value of testCases) {
      const result = assertUndefined.validate(value);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be undefined');
    }
  });
});
