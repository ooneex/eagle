import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { ValidatorDecoratorException } from './ValidatorDecoratorException.ts';

export const validator = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}) => {
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

export const assert = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}) => {
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

const ensureIsValidator = (name: string, validator: any) => {
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

const ensureIsAssert = (name: string, assert: any) => {
  if (!name?.startsWith('Assert') || !assert.prototype.validate) {
    throw new ValidatorDecoratorException(
      `Assert decorator can only be used on assert classes. ${name} must start with Assert keyword implement IAssert interface.`,
    );
  }
};
