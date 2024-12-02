import { parseString } from '../../helper/parseString.ts';
import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Validates that a value is an array containing only numbers.
 * Can handle string representations of numbers.
 *
 * @example
 * ```ts
 * const assert = new AssertNumberArray();
 *
 * assert.validate([1, 2, 3]); // { success: true, message: '...' }
 * assert.validate(['1', '2', '3']); // { success: true, message: '...' }
 * assert.validate(['a', 'b']); // { success: false, message: '...' }
 * ```
 */
@assert()
export class AssertNumberArray implements IAssert {
  /**
   * Validates if the input value is an array of numbers.
   * Attempts to parse string values as numbers.
   *
   * @param value - The value to validate
   * @returns Validation result with success status and message
   *
   * @example
   * ```ts
   * const validator = new AssertNumberArray();
   * const result = validator.validate([1, '2', 3]);
   * console.log(result); // { success: true, message: 'Value must be an array of numbers' }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const isArrayOfNumbers = value.every((item) => {
      if (typeof item === 'string') {
        item = parseString(item);
      }

      return typeof item === 'number';
    });

    return {
      success: isArrayOfNumbers,
      message: 'Value must be an array of numbers',
    };
  }
}
