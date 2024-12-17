import { assert } from '../decorators.ts';
import { AssertValidateReturnType, IAssert } from '../types.ts';
import { AssertString } from './AssertString.ts';

/**
 * A class that validates if a value is a valid URL.
 * First checks if the value is a string, then attempts to construct a URL object.
 *
 * @example
 * ```ts
 * const assertUrl = new AssertUrl();
 *
 * // Valid URL
 * assertUrl.validate('https://example.com');
 * // { success: true, message: 'Value is a valid URL' }
 *
 * // Invalid URL
 * assertUrl.validate('not-a-url');
 * // { success: false, message: 'Value must be a valid URL' }
 *
 * // Non-string value
 * assertUrl.validate(123);
 * // { success: false, message: 'Value must be a string' }
 * ```
 */
@assert()
export class AssertUrl implements IAssert {
  /**
   * Validates if the provided value is a valid URL
   *
   * @param value - The value to validate
   * @returns An object containing validation result and message
   * @example
   * ```ts
   * validate('https://example.com'); // Valid URL
   * validate('not-a-url'); // Invalid URL format
   * validate(123); // Not a string
   * ```
   */
  public validate(value: unknown): AssertValidateReturnType {
    const assertString = new AssertString();
    const stringValidation = assertString.validate(value);
    if (!stringValidation.success) {
      return stringValidation;
    }

    const urlPattern = /^(https?|ftp|ws):\/\/[^\s/$.?#].[^\s]*$/i;
    const isValidUrl = urlPattern.test(value as string);

    return {
      success: isValidUrl,
      message: isValidUrl
        ? 'Value is a valid URL'
        : 'Value must be a valid URL',
    };
  }
}
