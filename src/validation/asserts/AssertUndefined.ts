import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Class for validating if a value is undefined
 *
 * @example
 * ```ts
 * const assertUndefined = new AssertUndefined();
 * const result = assertUndefined.validate(undefined); // {success: true, message: '...'}
 * const result2 = assertUndefined.validate('test'); // {success: false, message: '...'}
 * ```
 */
@assert()
export class AssertUndefined implements IAssert {
  /**
   * Validates if the given value is undefined
   *
   * @param value - Value to validate
   * @returns Validation result with success boolean and message
   *
   * @example
   * ```ts
   * const assertUndefined = new AssertUndefined();
   * const result = assertUndefined.validate(undefined);
   * console.log(result.success); // true
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    return {
      success: typeof value === 'undefined',
      message: 'Value must be undefined',
    };
  }
}
