import {
  IValidator,
  ValidationResultType,
  ValidatorScopeType,
} from './types.ts';
import { validate } from './validate.ts';

/**
 * Abstract base class for validation implementations.
 * Implements the IValidator interface and provides common validation functionality.
 *
 * @example
 * ```ts
 * class CustomValidator extends AbstractValidator {
 *   getScope() {
 *     return 'custom' as ValidatorScopeType;
 *   }
 * }
 * ```
 */
export abstract class AbstractValidator implements IValidator {
  /**
   * Gets the scope type for this validator
   * @returns The validator's scope type
   */
  abstract getScope(): ValidatorScopeType;

  /**
   * Validates the provided data using this validator's rules
   * @param data The data to validate
   * @returns The validation result
   *
   * @example
   * ```ts
   * const validator = new CustomValidator();
   * const result = validator.validate({foo: 'bar'});
   * ```
   */
  public validate(data: unknown): ValidationResultType {
    return validate(this, data);
  }
}
