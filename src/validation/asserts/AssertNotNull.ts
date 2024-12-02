import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * Assert class to validate that a value is not null.
 * Implements the IAssert interface.
 *
 * @example
 * ```ts
 * const assertNotNull = new AssertNotNull();
 * const result = assertNotNull.validate(null); // {success: false, message: 'Value must not be null'}
 * const result2 = assertNotNull.validate("test"); // {success: true, message: 'Value must not be null'}
 * ```
 */
@assert()
export class AssertNotNull implements IAssert {
  /**
   * Validates that the provided value is not null
   *
   * @param value - Value to validate
   * @returns AssertValidateReturnType with success boolean and error message
   *
   * @example
   * ```ts
   * const value = null;
   * const result = validate(value);
   * // Returns {success: false, message: 'Value must not be null'}
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    return {
      success: value !== null,
      message: 'Value must not be null',
    };
  }
}
