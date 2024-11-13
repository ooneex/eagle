import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertNumberArray } from '@/validation/mod.ts';

describe('AssertNumberArray', () => {
  it('should return false for non-array values', () => {
    const assert = new AssertNumberArray();
    const result = assert.validate('not an array');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must be an array');
  });

  it('should return true for array of numbers', () => {
    const assert = new AssertNumberArray();
    const result = assert.validate([1, 2, 3]);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be an array of numbers');
  });

  it('should return false for array with non-number values', () => {
    const assert = new AssertNumberArray();
    const result = assert.validate([1, '2', 3]);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must be an array of numbers');
  });

  it('should return false for empty array', () => {
    const assert = new AssertNumberArray();
    const result = assert.validate([]);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be an array of numbers');
  });

  it('should return false for array with mixed types', () => {
    const assert = new AssertNumberArray();
    const result = assert.validate([1, 'string', true, {}]);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must be an array of numbers');
  });
});
