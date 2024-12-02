import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * A class that validates an array of email addresses.
 *
 * @example
 * ```ts
 * const emailValidator = new AssertEmailArray();
 * const result = emailValidator.validate(['test@example.com', 'invalid@email']);
 * console.log(result); // { success: false, message: 'Value must contain only valid emails' }
 * ```
 */
@assert()
export class AssertEmailArray implements IAssert {
  /**
   * Validates that the provided value is an array of valid email addresses.
   *
   * @param value - The value to validate
   * @returns Object indicating validation success/failure with message
   *
   * @example
   * ```ts
   * const validator = new AssertEmailArray();
   *
   * // Valid email array
   * validator.validate(['user@example.com', 'test@test.com']);
   * // Returns { success: true, message: '' }
   *
   * // Invalid input - not an array
   * validator.validate('not-an-array');
   * // Returns { success: false, message: 'Value must be an array' }
   *
   * // Invalid input - contains invalid email
   * validator.validate(['valid@email.com', 'invalid-email']);
   * // Returns { success: false, message: 'Value must contain only valid emails' }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    for (const email of value) {
      if (typeof email !== 'string') {
        return {
          success: false,
          message: 'Value must contain only strings',
        };
      }
      if (!emailPattern.test(email)) {
        return {
          success: false,
          message: 'Value must contain only valid emails',
        };
      }
    }

    return {
      success: true,
      message: '',
    };
  }
}
