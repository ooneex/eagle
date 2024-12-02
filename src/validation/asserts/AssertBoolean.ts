import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * A class that validates if a value is a boolean.
 *
 * @example
 * ```ts
 * const validator = new AssertBoolean();
 *
 * validator.validate(true); // {success: true, message: 'Value must be a boolean'}
 * validator.validate('test'); // {success: false, message: 'Value must be a boolean'}
 * ```
 */
@assert()
export class AssertBoolean implements IAssert {
  /**
   * Validates if the provided value is a boolean.
   *
   * @param value - The value to validate
   * @returns An object containing the validation result and message
   *
   * @example
   * ```ts
   * const validator = new AssertBoolean();
   * const result = validator.validate(true);
   * console.log(result); // {success: true, message: 'Value must be a boolean'}
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    return {
      success: typeof value === 'boolean',
      message: 'Value must be a boolean',
    };
  }
}
