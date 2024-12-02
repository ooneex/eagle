import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';

/**
 * A class to validate if a value is a valid Date object.
 *
 * @example
 * ```ts
 * const dateValidator = new AssertDate();
 * const validDate = dateValidator.validate(new Date()); // returns {success: true, message: 'Value must be a Date'}
 * const invalidDate = dateValidator.validate('not a date'); // returns {success: false, message: 'Value must be a Date'}
 * ```
 */
@assert()
export class AssertDate implements IAssert {
  /**
   * Validates if the provided value is a valid Date object
   * @param value The value to validate
   * @returns An object containing the validation result and error message
   * @example
   * ```ts
   * const validator = new AssertDate();
   * validator.validate(new Date()); // {success: true, message: 'Value must be a Date'}
   * validator.validate(null); // {success: false, message: 'Value must be a Date'}
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    const isDate = value instanceof Date && !Number.isNaN(value.getTime());

    return {
      success: isDate,
      message: 'Value must be a Date',
    };
  }
}
