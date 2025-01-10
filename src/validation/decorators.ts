import { container } from '@/container/container.ts';
import type { DecoratorScopeType } from '@/types.ts';
import { ValidatorDecoratorException } from './ValidatorDecoratorException.ts';
import { ValidatorContainer } from './container.ts';
import type { ValidatorScopeType } from './types.ts';

export const validator = (
  on: ValidatorScopeType,
  options?: {
    scope?: DecoratorScopeType;
  },
): ClassDecorator => {
  return (validator: any) => {
    const name = validator.prototype.constructor.name;
    ensureIsValidator(name, validator);

    if (options?.scope === 'request') {
      container.bind(validator).toSelf().inRequestScope();
    } else if (options?.scope === 'transient') {
      container.bind(validator).toSelf().inTransientScope();
    } else {
      container.bind(validator).toSelf().inSingletonScope();
    }

    ValidatorContainer.get(on)?.push(validator);
  };
};

const ensureIsValidator = (name: string, validator: any): void => {
  if (!name.endsWith('Validator') || !validator.prototype.validate) {
    throw new ValidatorDecoratorException(
      `Validator decorator can only be used on validator classes. ${name} must end with Validator keyword and implement IValidator interface.`,
    );
  }
};
