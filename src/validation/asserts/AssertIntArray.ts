import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Class for validating arrays containing only integer values.
 *
 * @example
 * ```ts
 * const validator = new AssertIntArray();
 *
 * // Valid integer array
 * validator.validate([1, 2, 3]); // { success: true, message: 'All array values must be integers' }
 *
 * // Invalid - contains non-integer
 * validator.validate([1, 2.5, 3]); // { success: false, message: 'All array values must be integers' }
 *
 * // Invalid - not an array
 * validator.validate("not an array"); // { success: false, message: 'Value must be an array' }
 * ```
 */
@assert()
export class AssertIntArray implements IAssert {
  /**
   * Validates that the input value is an array containing only integer values.
   *
   * @param value - The value to validate
   * @returns {AssertValidateReturnType} Validation result with success status and message
   * @example
   * ```ts
   * const validator = new AssertIntArray();
   * const result = validator.validate([1, 2, 3]);
   * console.log(result); // { success: true, message: 'All array values must be integers' }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const allIntegers = value.every(
      (item) =>
        typeof item === 'number' &&
        !Number.isNaN(item) &&
        Number.isFinite(item) &&
        item % 1 === 0,
    );

    return {
      success: allIntegers,
      message: 'All array values must be integers',
    };
  }
}
