import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';
import { AssertString } from './AssertString.ts';

/**
 * Validates if a value is a valid name string.
 * A valid name must start with a letter and contain only letters, numbers and spaces.
 *
 * @example
 * ```ts
 * const nameValidator = new AssertName();
 *
 * // Valid names
 * nameValidator.validate('John Doe'); // { success: true }
 * nameValidator.validate('Jane123'); // { success: true }
 *
 * // Invalid names
 * nameValidator.validate('123John'); // { success: false }
 * nameValidator.validate('John@Doe'); // { success: false }
 * ```
 */
@assert()
export class AssertName implements IAssert {
  /**
   * Validates if the provided value is a valid name string
   *
   * @param value - Value to validate
   * @returns ValidationResult indicating if value is valid name
   * @example
   * ```ts
   * const validator = new AssertName();
   * const result = validator.validate('John Doe');
   * if (result.success) {
   *   // Value is a valid name
   * }
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    const isString = new AssertString().validate(value);
    if (!isString.success) return isString;

    return {
      success: /^[a-z][a-z0-9 ]+$/i.test(value as string),
      message: 'Value must be a valid name',
    };
  }
}
