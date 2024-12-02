import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Asserts that a value is an array and does not contain any null values.
 *
 * @example
 * ```ts
 * const assert = new AssertNotNullArray();
 *
 * assert.validate([1, 2, 3]); // { success: true, message: 'Array must not contain null values' }
 * assert.validate([1, null, 3]); // { success: false, message: 'Array must not contain null values' }
 * assert.validate('not-array'); // { success: false, message: 'Value must be an array' }
 * ```
 */
@assert()
export class AssertNotNullArray implements IAssert {
  /**
   * Validates that the given value is an array and contains no null values
   *
   * @param value - The value to validate
   * @returns Validation result indicating success and error message
   * @example
   * ```ts
   * const validator = new AssertNotNullArray();
   * const result = validator.validate([1, 2, 3]);
   * console.log(result.success); // true
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const hasNull = value.some((item) => item === null);
    return {
      success: !hasNull,
      message: 'Array must not contain null values',
    };
  }
}
