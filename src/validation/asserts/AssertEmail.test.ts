import { AssertEmail } from '@/validation/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('AssertEmail', () => {
  it('should validate correct email addresses', () => {
    const assert = new AssertEmail();
    const result = assert.validate('test@example.com');

    expect(result.success).toBe(true);
    expect(result.message).toBe('Value must be a valid email address');
  });

  it('should reject invalid email addresses', () => {
    const assert = new AssertEmail();
    const invalidEmails = [
      'test@',
      '@example.com',
      'test@.com',
      'test@example.',
      'test@exam ple.com',
      'test example@example.com',
    ];

    for (const email of invalidEmails) {
      const result = assert.validate(email);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be a valid email address');
    }
  });

  it('should reject non-string values', () => {
    const assert = new AssertEmail();
    const nonStringValues = [
      123,
      true,
      {},
      [],
      null,
      undefined,
    ];

    for (const value of nonStringValues) {
      const result = assert.validate(value);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Value must be a string');
    }
  });

  it('should use the provided property name in error messages', () => {
    const assert = new AssertEmail();
    const result = assert.validate('invalid');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must be a valid email address');
  });
});
