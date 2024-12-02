import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Assert implementation for validating that a value is a function.
 *
 * @example
 * ```ts
 * const assertFunction = new AssertFunction();
 *
 * // Valid function check
 * assertFunction.validate(() => {}); // returns {success: true, message: '...'}
 *
 * // Invalid function check
 * assertFunction.validate('not a function'); // returns {success: false, message: '...'}
 * ```
 */
@assert()
export class AssertFunction implements IAssert {
  /**
   * Validates that the provided value is a function
   *
   * @param value - The value to validate
   * @returns Object containing success status and validation message
   *
   * @example
   * ```ts
   * const result = assertFunction.validate(() => {});
   * console.log(result.success); // true
   * console.log(result.message); // 'Value must be an array'
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    return {
      success: typeof value === 'function',
      message: 'Value must be a function',
    };
  }
}
