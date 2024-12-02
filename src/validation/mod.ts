/**
 * Validation module providing robust data validation and assertion utilities.
 *
 * @module validation
 *
 * @example
 * ```ts
 * // Basic validation using decorators
 * class UserValidation {
 *   name: string;
 *   email: string;
 *   age: number;
 * }
 *
 * // Validate instance
 * const user = new UserValidation();
 * const errors = await validate(user);
 *
 * if (errors.length > 0) {
 *   console.log('Validation failed:', errors);
 * }
 * ```
 */

export { AssertArray } from './asserts/AssertArray.ts';
export { AssertBigint } from './asserts/AssertBigint.ts';
export { AssertBigintArray } from './asserts/AssertBigintArray.ts';
export { AssertBoolean } from './asserts/AssertBoolean.ts';
export { AssertBooleanArray } from './asserts/AssertBooleanArray.ts';
export { AssertDate } from './asserts/AssertDate.ts';
export { AssertDateArray } from './asserts/AssertDateArray.ts';
export { AssertEmail } from './asserts/AssertEmail.ts';
export { AssertEmailArray } from './asserts/AssertEmailArray.ts';
export { AssertFloat } from './asserts/AssertFloat.ts';
export { AssertFloatArray } from './asserts/AssertFloatArray.ts';
export { AssertFunction } from './asserts/AssertFunction.ts';
export { AssertFunctionArray } from './asserts/AssertFunctionArray.ts';
export { AssertInt } from './asserts/AssertInt.ts';
export { AssertIntArray } from './asserts/AssertIntArray.ts';
export { AssertName } from './asserts/AssertName.ts';
export { AssertNotNull } from './asserts/AssertNotNull.ts';
export { AssertNotNullArray } from './asserts/AssertNotNullArray.ts';
export { AssertNull } from './asserts/AssertNull.ts';
export { AssertNullArray } from './asserts/AssertNullArray.ts';
export { AssertNumber } from './asserts/AssertNumber.ts';
export { AssertNumberArray } from './asserts/AssertNumberArray.ts';
export { AssertString } from './asserts/AssertString.ts';
export { AssertStringArray } from './asserts/AssertStringArray.ts';
export { AssertUndefined } from './asserts/AssertUndefined.ts';
export { AssertUndefinedArray } from './asserts/AssertUndefinedArray.ts';

export { AbstractValidator } from './AbstractValidator.ts';
export * from './decorators.ts';
export * from './types.ts';
export * from './validate.ts';
export { ValidationException } from './ValidationException.ts';
export { ValidationFailedException } from './ValidationFailedException.ts';
export { ValidatorDecoratorException } from './ValidatorDecoratorException.ts';
