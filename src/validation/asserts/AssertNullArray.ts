import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Class that asserts if a value is an array containing only null values
 *
 * @example
 * ```ts
 * const assert = new AssertNullArray();
 *
 * assert.validate([null, null]); // returns {success: true, message: '...'}
 * assert.validate([1, null]); // returns {success: false, message: '...'}
 * assert.validate('not an array'); // returns {success: false, message: '...'}
 * ```
 */
@assert()
export class AssertNullArray implements IAssert {
  /**
   * Validates if the provided value is an array containing only null values
   *
   * @param value - The value to validate
   * @returns Object containing validation result and message
   *
   * @example
   * ```ts
   * const assert = new AssertNullArray();
   * const result = assert.validate([null, null, null]);
   * console.log(result.success); // true
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    return {
      success: Array.isArray(value) && value.every((item) => item === null),
      message: 'Value must be an array containing only null values',
    };
  }
}
