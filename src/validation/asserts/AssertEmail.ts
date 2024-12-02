import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Class for validating email addresses.
 * Implements the IAssert interface to provide email validation functionality.
 *
 * @example
 * ```ts
 * const emailValidator = new AssertEmail();
 * const result = emailValidator.validate('test@example.com');
 * console.log(result); // { success: true, message: 'Value must be a valid email address' }
 * ```
 */
@assert()
export class AssertEmail implements IAssert {
  /**
   * Validates if the provided value is a valid email address.
   * Checks if the value is a string and matches basic email pattern.
   *
   * @param value - Value to validate as email address
   * @returns Object containing validation result and message
   *
   * @example
   * ```ts
   * validate('invalid-email'); // { success: false, message: 'Value must be a valid email address' }
   * validate('valid@email.com'); // { success: true, message: 'Value must be a valid email address' }
   * validate(123); // { success: false, message: 'Value must be a string' }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    if (typeof value !== 'string') {
      return {
        success: false,
        message: 'Value must be a string',
      };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return {
      success: emailPattern.test(value),
      message: 'Value must be a valid email address',
    };
  }
}
