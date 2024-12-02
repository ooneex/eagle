import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Assert class for validating if a value is null.
 *
 * @example
 * ```ts
 * const assertNull = new AssertNull();
 * const result = assertNull.validate(null);
 * console.log(result.success); // true
 * ```
 */
@assert()
export class AssertNull implements IAssert {
  /**
   * Validates if the given value is null
   *
   * @param value - Value to validate
   * @returns Validation result object with success status and message
   *
   * @example
   * ```ts
   * const assertNull = new AssertNull();
   *
   * assertNull.validate(null);
   * // { success: true, message: 'Value must be null' }
   *
   * assertNull.validate('test');
   * // { success: false, message: 'Value must be null' }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    return {
      success: value === null,
      message: 'Value must be null',
    };
  }
}
