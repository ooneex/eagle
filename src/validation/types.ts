/**
 * Available validator scopes for validation operations
 * @constant {readonly string[]}
 */
export const ValidatorScopes = [
  'payload',
  'params',
  'queries',
  'headers',
  'cookies',
  'files',
  'form',
  'env',
] as const;

/**
 * Type representing possible validator scopes
 * @type {string | null}
 */
export type ValidatorScopeType = (typeof ValidatorScopes)[number] | null;

/**
 * Interface for validator implementations
 * @interface
 * @example
 * ```ts
 * class MyValidator implements IValidator {
 *   getScope() {
 *     return 'payload';
 *   }
 *
 *   validate(data: unknown) {
 *     // validation logic
 *     return {
 *       success: true,
 *       details: []
 *     };
 *   }
 * }
 * ```
 */
export interface IValidator {
  /**
   * Gets the validation scope
   * @returns {ValidatorScopeType} The validator scope
   */
  getScope: () => ValidatorScopeType;

  /**
   * Validates the provided data
   * @param {unknown} data - Data to validate
   * @returns {ValidationResultType} Validation result
   */
  validate: (data: unknown) => ValidationResultType;
}

/**
 * Type representing assert validation result
 * @type {Object}
 */
export type AssertValidateReturnType = {
  success: boolean;
  message: string;
  key?: string;
};

/**
 * Interface for assertion implementations
 * @interface
 * @example
 * ```ts
 * class MyAssert implements IAssert {
 *   validate(value: unknown) {
 *     return {
 *       success: true,
 *       message: 'Valid'
 *     };
 *   }
 * }
 * ```
 */
export interface IAssert {
  /**
   * Validates a value
   * @param {unknown} value - Value to validate
   * @returns {AssertValidateReturnType} Validation result
   */
  validate: (
    value: unknown,
  ) => AssertValidateReturnType;
}

/**
 * Type representing validation operation result
 * @type {Object}
 */
export type ValidationResultType = {
  success: boolean;
  details: {
    property: string;
    success: boolean;
    message: string;
  }[];
};
