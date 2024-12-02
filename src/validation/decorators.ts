import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { ValidatorDecoratorException } from './ValidatorDecoratorException.ts';

/**
 * Validator decorator for registering validator classes in the container
 *
 * @param options Configuration options
 * @param options.scope Optional container scope type
 * @param options.singleton Optional flag to make singleton
 *
 * @example
 * ```ts
 * @validator({
 *   scope: 'custom',
 *   singleton: true
 * })
 * class UserValidator implements IValidator {
 *   validate(value: any): boolean {
 *     // validation logic
 *   }
 *
 *   getScope(): string {
 *     return 'user';
 *   }
 * }
 * ```
 */
export const validator = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}): ClassDecorator => {
  return (validator: any) => {
    const name = validator.prototype.constructor.name;
    ensureIsValidator(name, validator);

    container.add(name, validator, {
      scope: options?.scope ?? 'validator',
      singleton: options?.singleton ?? true,
      instance: false,
    });
  };
};

/**
 * Assert decorator for registering assert classes in the container
 *
 * @param options Configuration options
 * @param options.scope Optional container scope type
 * @param options.singleton Optional flag to make singleton
 *
 * @example
 * ```ts
 * @assert({
 *   scope: 'custom',
 *   singleton: true
 * })
 * class AssertEmail implements IAssert {
 *   validate(value: any): boolean {
 *     // validation logic
 *   }
 * }
 * ```
 */
export const assert = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}): ClassDecorator => {
  return (assert: any) => {
    const name = assert.prototype.constructor.name;
    ensureIsAssert(name, assert);

    container.add(name, assert, {
      scope: options?.scope ?? 'assert',
      singleton: options?.singleton ?? true,
      instance: false,
    });
  };
};

/**
 * Ensures a class is a valid validator implementation
 *
 * @param name The validator class name
 * @param validator The validator class
 * @throws {ValidatorDecoratorException} If validation fails
 */
const ensureIsValidator = (name: string, validator: any): void => {
  if (
    !name?.endsWith('Validator') ||
    !validator.prototype.getScope ||
    !validator.prototype.validate
  ) {
    throw new ValidatorDecoratorException(
      `Validator decorator can only be used on validator classes. ${name} must end with Validator keyword and implement IValidator interface.`,
    );
  }
};

/**
 * Ensures a class is a valid assert implementation
 *
 * @param name The assert class name
 * @param assert The assert class
 * @throws {ValidatorDecoratorException} If validation fails
 */
const ensureIsAssert = (name: string, assert: any): void => {
  if (!name?.startsWith('Assert') || !assert.prototype.validate) {
    throw new ValidatorDecoratorException(
      `Assert decorator can only be used on assert classes. ${name} must start with Assert keyword implement IAssert interface.`,
    );
  }
};
