import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Validates that a value is an array containing only float numbers.
 *
 * @example
 * ```ts
 * const assert = new AssertFloatArray();
 *
 * assert.validate([1.5, 2.7, 3.14]); // returns { success: true, message: '' }
 * assert.validate([1, 2, 3]); // returns { success: false, message: 'Value must contain only float values' }
 * assert.validate('not an array'); // returns { success: false, message: 'Value must be an array' }
 * ```
 */
@assert()
export class AssertFloatArray implements IAssert {
  /**
   * Validates that the provided value is an array of float numbers.
   *
   * @param value - The value to validate
   * @returns Validation result indicating success/failure with message
   *
   * @example
   * ```ts
   * const validator = new AssertFloatArray();
   * const result = validator.validate([1.5, 2.7]);
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

    for (const item of value) {
      const isFloat = typeof item === 'number' && !Number.isNaN(item) &&
        Number.isFinite(item) && item % 1 !== 0;

      if (!isFloat) {
        return {
          success: false,
          message: 'Value must contain only float values',
        };
      }
    }

    return {
      success: true,
      message: '',
    };
  }
}
