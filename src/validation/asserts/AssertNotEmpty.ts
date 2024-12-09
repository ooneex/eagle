import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';
import { AssertString } from './AssertString.ts';

/**
 * Validates if a value is a non-empty string after trimming whitespace.
 *
 * @example
 * ```ts
 * const validator = new AssertNotEmpty();
 *
 * // Valid non-empty strings
 * validator.validate('hello'); // { success: true }
 * validator.validate('  world  '); // { success: true }
 *
 * // Invalid empty strings
 * validator.validate(''); // { success: false }
 * validator.validate('   '); // { success: false }
 * validator.validate(null); // { success: false }
 * ```
 */
@assert()
export class AssertNotEmpty implements IAssert {
  /**
   * Validates if the provided value is a non-empty string after trimming
   *
   * @param value - Value to validate
   * @returns ValidationResult indicating if value is non-empty string
   * @example
   * ```ts
   * const validator = new AssertNotEmpty();
   * const result = validator.validate('Hello world');
   * if (result.success) {
   *   // Value is a non-empty string
   * }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    const isString = new AssertString().validate(value);
    if (!isString.success) return isString;

    return {
      success: (value as string).trim().length > 0,
      message: 'Value must not be empty',
    };
  }
}
