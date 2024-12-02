import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertNull } from '../mod.ts';

describe('AssertNull', () => {
  const validator = new AssertNull();

  it('should return success when value is null', () => {
    const result = validator.validate(null);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be null');
  });

  it('should return failure when value is not null', () => {
    const testCases = [
      undefined,
      0,
      '',
      false,
      {},
      [],
      'test',
      42,
    ];

    for (const value of testCases) {
      const result = validator.validate(value);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be null');
    }
  });
});
