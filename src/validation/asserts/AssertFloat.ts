import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Asserts that a value is a floating point number.
 *
 * @example
 * ```ts
 * const float = new AssertFloat();
 *
 * float.validate(3.14); // returns { success: true, message: 'Value must be a float' }
 * float.validate(42); // returns { success: false, message: 'Value must be a float' }
 * float.validate('1.23'); // returns { success: false, message: 'Value must be a float' }
 * ```
 */
@assert()
export class AssertFloat implements IAssert {
  /**
   * Validates if the provided value is a float.
   *
   * @param value - The value to validate
   * @returns Object containing validation result and message
   *
   * @example
   * ```ts
   * const float = new AssertFloat();
   * const result = float.validate(3.14);
   * console.log(result); // { success: true, message: 'Value must be a float' }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    const isFloat = typeof value === 'number' && !Number.isNaN(value) &&
      Number.isFinite(value) && value % 1 !== 0;

    return {
      success: isFloat,
      message: 'Value must be a float',
    };
  }
}
