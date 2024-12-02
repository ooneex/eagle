import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Class representing a validator for an array of BigInt values.
 *
 * @example
 * ```ts
 * const validator = new AssertBigintArray();
 *
 * validator.validate([1n, 2n, 3n]); // {success: true, message: 'Value must be an array of bigints'}
 * validator.validate([1, 2, 3]); // {success: false, message: 'Value must be an array of bigints'}
 * ```
 */
@assert()
export class AssertBigintArray implements IAssert {
  /**
   * Validates that a value is an array containing only BigInt values
   *
   * @param value - The value to validate
   * @returns Object containing success boolean and validation message
   *
   * @example
   * ```ts
   * const validator = new AssertBigintArray();
   * const result = validator.validate([1n, 2n, 3n]);
   * console.log(result); // {success: true, message: 'Value must be an array of bigints'}
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    const isBigintArray = Array.isArray(value) &&
      value.every((item) => typeof item === 'bigint');

    return {
      success: isBigintArray,
      message: 'Value must be an array of bigints',
    };
  }
}
