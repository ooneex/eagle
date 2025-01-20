import type { ValidatorOptions } from 'class-validator';
import { container } from '../container';
import type { DecoratorScopeType } from '../types';
import { ValidatorDecoratorException } from './ValidatorDecoratorException';
import { ValidatorContainer } from './container';
import type { ValidatorScopeType } from './types';

export const validator = (
  dataScope: ValidatorScopeType,
  options?: {
    scope?: DecoratorScopeType;
  } & ValidatorOptions,
): ClassDecorator => {
  return (validator: any) => {
    const name = validator.prototype.constructor.name;
    ensureIsValidator(name, validator);

    if (options?.scope === 'transient') {
      container.bind(validator).toSelf().inTransientScope();
    } else {
      container.bind(validator).toSelf().inSingletonScope();
    }

    // biome-ignore lint/performance/noDelete: trust me
    delete options?.scope;

    ValidatorContainer.get(dataScope)?.push({ value: validator, options });
  };
};

const ensureIsValidator = (name: string, validator: any): void => {
  if (!name.endsWith('Validator') || !validator.prototype.validate) {
    throw new ValidatorDecoratorException(
      `Validator decorator can only be used on validator classes. ${name} must end with Validator keyword and implement IValidator interface.`,
    );
  }
};
