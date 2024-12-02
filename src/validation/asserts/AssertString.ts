import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * A validator class that asserts whether a value is a string
 *
 * @example
 * ```ts
 * const assertString = new AssertString();
 * const result = assertString.validate('test'); // {success: true, message: 'Value must be a string'}
 * const result2 = assertString.validate(123); // {success: false, message: 'Value must be a string'}
 * ```
 */
@assert()
export class AssertString implements IAssert {
  /**
   * Validates that the provided value is a string
   *
   * @param value - The value to validate
   * @returns Object containing validation result and message
   *
   * @example
   * ```ts
   * const validator = new AssertString();
   * validator.validate('test'); // Success
   * validator.validate(123); // Failure
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    return {
      success: typeof value === 'string',
      message: 'Value must be a string',
    };
  }
}
