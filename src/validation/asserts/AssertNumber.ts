import { parseString } from '../../helper/parseString.ts';
import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * A class that validates if a value is a number.
 * Can handle string inputs by attempting to parse them to numbers.
 *
 * @example
 * ```ts
 * const numberValidator = new AssertNumber();
 *
 * numberValidator.validate(123); // { success: true, message: 'Value must be a number' }
 * numberValidator.validate("123"); // { success: true, message: 'Value must be a number' }
 * numberValidator.validate("abc"); // { success: false, message: 'Value must be a number' }
 * ```
 */
@assert()
export class AssertNumber implements IAssert {
  /**
   * Validates if the provided value is a number or can be parsed into a number
   *
   * @param value - The value to validate
   * @returns ValidationResult indicating if value is a valid number
   * @example
   * ```ts
   * const validator = new AssertNumber();
   * validator.validate(42); // Success
   * validator.validate("123"); // Success after parsing
   * validator.validate("abc"); // Failure
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    if (typeof value === 'string') {
      value = parseString(value);
    }

    return {
      success: typeof value === 'number',
      message: 'Value must be a number',
    };
  }
}
