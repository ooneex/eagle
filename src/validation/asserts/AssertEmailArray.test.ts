import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { AssertEmailArray } from '@/validation/mod.ts';

describe('AssertEmailArray', () => {
  it('should pass validation for array of valid email addresses', () => {
    const emails = ['test@example.com', 'user@domain.com'];
    const asserter = new AssertEmailArray();
    const result = asserter.validate(emails);
    expect(result.success).toBe(true);
    expect(result.message).toBe('');
  });

  it('should fail validation for array containing invalid email', () => {
    const emails = ['test@example.com', 'invalid-email'];
    const asserter = new AssertEmailArray();
    const result = asserter.validate(emails);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must contain only valid emails');
  });

  it('should fail validation for non-array input', () => {
    const asserter = new AssertEmailArray();
    const result = asserter.validate('not-an-array' as unknown);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must be an array');
  });

  it('should fail validation for array with non-string elements', () => {
    const emails = ['test@example.com', 123];
    const asserter = new AssertEmailArray();
    const result = asserter.validate(emails as any);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Value must contain only strings');
  });

  it('should pass validation for empty array', () => {
    const emails: string[] = [];
    const asserter = new AssertEmailArray();
    const result = asserter.validate(emails);
    expect(result.success).toBe(true);
    expect(result.message).toBe('');
  });
});
