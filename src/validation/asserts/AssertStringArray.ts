import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Validates that a value is an array containing only string elements.
 *
 * @example
 * ```ts
 * const assert = new AssertStringArray();
 *
 * // Valid usage
 * assert.validate(['a', 'b', 'c']); // { success: true, message: '' }
 *
 * // Invalid usage
 * assert.validate(['a', 1, 'c']); // { success: false, message: 'All array items must be strings' }
 * assert.validate('not an array'); // { success: false, message: 'Value must be an array' }
 * ```
 */
@assert()
export class AssertStringArray implements IAssert {
  /**
   * Validates that the provided value is an array of strings.
   *
   * @param value - The value to validate
   * @returns A validation result object indicating success/failure and error message
   *
   * @example
   * ```ts
   * const validator = new AssertStringArray();
   * const result = validator.validate(['hello', 'world']);
   * console.log(result); // { success: true, message: '' }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const areAllStrings = value.every((item) => typeof item === 'string');

    return {
      success: areAllStrings,
      message: areAllStrings ? '' : 'All array items must be strings',
    };
  }
}
