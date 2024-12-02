import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Asserts that a value is an array containing only function elements.
 *
 * @example
 * ```ts
 * const validator = new AssertFunctionArray();
 *
 * // Valid cases
 * validator.validate([() => {}, function() {}]); // Returns {success: true}
 *
 * // Invalid cases
 * validator.validate([]); // Returns {success: true}
 * validator.validate([1, "string"]); // Returns {success: false}
 * validator.validate("not array"); // Returns {success: false}
 * ```
 */
@assert()
export class AssertFunctionArray implements IAssert {
  /**
   * Validates that the input is an array containing only function elements
   *
   * @param value - The value to validate
   * @returns Object containing success status and error message if validation fails
   *
   * @example
   * ```ts
   * const validator = new AssertFunctionArray();
   * const result = validator.validate([() => {}, function() {}]);
   * if (result.success) {
   *   // Value is valid array of functions
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

    const allFunctions = value.every((item) => typeof item === 'function');

    return {
      success: allFunctions,
      message: allFunctions ? '' : 'All array elements must be functions',
    };
  }
}
