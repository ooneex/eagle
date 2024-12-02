import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Validates that a value is an integer number.
 *
 * @example
 * ```ts
 * const validator = new AssertInt();
 * validator.validate(42); // { success: true, message: 'Value must be an integer' }
 * validator.validate(3.14); // { success: false, message: 'Value must be an integer' }
 * ```
 */
@assert()
export class AssertInt implements IAssert {
  /**
   * Validates whether the given value is an integer.
   *
   * @param value - The value to validate
   * @returns Object containing validation result and error message
   *
   * @example
   * ```ts
   * const validator = new AssertInt();
   * validator.validate(42); // { success: true, message: 'Value must be an integer' }
   * validator.validate(3.14); // { success: false, message: 'Value must be an integer' }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    const isInt = typeof value === 'number' && !Number.isNaN(value) &&
      Number.isFinite(value) && value % 1 === 0;

    return {
      success: isInt,
      message: 'Value must be an integer',
    };
  }
}
