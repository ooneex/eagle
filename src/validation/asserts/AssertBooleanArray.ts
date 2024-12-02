import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * A class that validates if a value is an array of boolean values.
 *
 * @example
 * ```ts
 * const validator = new AssertBooleanArray();
 *
 * validator.validate([true, false]); // returns {success: true, message: '...'}
 * validator.validate(['true', false]); // returns {success: false, message: '...'}
 * ```
 */
@assert()
export class AssertBooleanArray implements IAssert {
  /**
   * Validates if the provided value is an array containing only boolean values.
   *
   * @param value - The value to validate
   * @returns An object indicating validation success and an error message
   * @example
   * ```ts
   * const result = validator.validate([true, false, true]);
   * console.log(result.success); // true
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    const isBooleanArray = Array.isArray(value) &&
      value.every((item) => typeof item === 'boolean');

    return {
      success: isBooleanArray,
      message: 'Value must be an array of booleans',
    };
  }
}
