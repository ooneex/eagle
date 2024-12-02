import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Asserts that a value is a bigint primitive type.
 *
 * @example
 * ```ts
 * const assertBigint = new AssertBigint();
 * assertBigint.validate(42n); // returns { success: true, message: 'value must be a bigint' }
 * assertBigint.validate(123); // returns { success: false, message: 'value must be a bigint' }
 * ```
 */
@assert()
export class AssertBigint implements IAssert {
  /**
   * Validates if the given value is a bigint.
   *
   * @param value - The value to validate
   * @returns An object indicating validation success and error message
   *
   * @example
   * ```ts
   * const result = assertBigint.validate(42n);
   * if (result.success) {
   *   // value is a bigint
   * }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    return {
      success: typeof value === 'bigint',
      message: 'value must be a bigint',
    };
  }
}
