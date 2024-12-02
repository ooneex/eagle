import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Validates that an array contains only undefined values.
 *
 * @example
 * ```ts
 * const asserter = new AssertUndefinedArray();
 *
 * // Valid array of undefined
 * asserter.validate([undefined, undefined]); // { success: true }
 *
 * // Invalid array with non-undefined values
 * asserter.validate([undefined, null]); // { success: false }
 *
 * // Invalid non-array value
 * asserter.validate("not an array"); // { success: false }
 * ```
 */
@assert()
export class AssertUndefinedArray implements IAssert {
  /**
   * Validates that the provided value is an array containing only undefined values.
   *
   * @param value - The value to validate
   * @returns {AssertValidateReturnType} Validation result with success status and message
   *
   * @example
   * ```ts
   * const result = asserter.validate([undefined, undefined]);
   * if (result.success) {
   *   // array contains only undefined values
   * }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const allUndefined = value.every((item) => typeof item === 'undefined');

    return {
      success: allUndefined,
      message: 'Array must contain only undefined values',
    };
  }
}
