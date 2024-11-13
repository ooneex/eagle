import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AssertStringArray } from '@/validation/mod.ts';

describe('AssertStringArray', () => {
  const assert = new AssertStringArray();

  it('should validate array of strings successfully', () => {
    const result = assert.validate(['test', 'hello', 'world']);
    expect(result.success).toBe(true);
    expect(result.message).toBe('');
  });

  it('should fail validation if value is not an array', () => {
    const result = assert.validate('not an array');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must be an array');
  });

  it('should fail validation if array contains non-string values', () => {
    const result = assert.validate(['test', 123, 'world']);
    expect(result.success).toBe(false);
    expect(result.message).toBe('All array items must be strings');
  });

  it('should validate empty array successfully', () => {
    const result = assert.validate([]);
    expect(result.success).toBe(true);
    expect(result.message).toBe('');
  });
});
