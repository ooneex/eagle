import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * A class that validates if a value is an array.
 *
 * @example
 * ```ts
 * const assertArray = new AssertArray();
 *
 * assertArray.validate([1,2,3]); // { success: true, message: 'Value must be an array' }
 * assertArray.validate('not array'); // { success: false, message: 'Value must be an array' }
 * ```
 */
@assert()
export class AssertArray implements IAssert {
  /**
   * Validates if the provided value is an array
   *
   * @param value - The value to validate
   * @returns An object containing validation result and message
   * @example
   * ```ts
   * validate([1,2,3]); // { success: true, message: 'Value must be an array' }
   * validate('not array'); // { success: false, message: 'Value must be an array' }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    return {
      success: Array.isArray(value),
      message: 'Value must be an array',
    };
  }
}
