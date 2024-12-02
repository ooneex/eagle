import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Validates that a value is an array containing only valid Date objects
 *
 * @example
 * ```ts
 * const assert = new AssertDateArray();
 *
 * // Valid date array
 * assert.validate([new Date(), new Date()]); // {success: true, message: 'Value must be an array of Dates'}
 *
 * // Invalid - not an array
 * assert.validate('not an array'); // {success: false, message: 'Value must be an array of Dates'}
 *
 * // Invalid - array with non-Date
 * assert.validate([new Date(), 'string']); // {success: false, message: 'Value must be an array of Dates'}
 * ```
 */
@assert()
export class AssertDateArray implements IAssert {
  /**
   * Validates that the provided value is an array of valid Date objects
   *
   * @param value - The value to validate
   * @returns ValidationResult indicating if value is array of valid Dates
   *
   * @example
   * ```ts
   * const validator = new AssertDateArray();
   * const result = validator.validate([new Date()]);
   * console.log(result.success); // true
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array of Dates',
      };
    }

    const isDateArray = value.every((item) =>
      item instanceof Date && !Number.isNaN(item.getTime())
    );

    return {
      success: isDateArray,
      message: 'Value must be an array of Dates',
    };
  }
}
