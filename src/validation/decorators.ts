import { container } from '@/container/Container.ts';
import { ValidatorDecoratorException } from '@/validation/ValidatorDecoratorException.ts';

export const validator = () => {
  return (validator: unknown, context: ClassDecoratorContext) => {
    ensureIsValidator(context, validator);

    container.add(context.name!, validator, {
      scope: 'validator',
      singleton: true,
      instance: false,
    });
  };
};

export const assert = () => {
  return (assert: unknown, context: ClassDecoratorContext) => {
    ensureIsAssert(context, assert);

    container.add(context.name!, assert, {
      scope: 'assert',
      singleton: true,
      instance: false,
    });
  };
};

const ensureIsValidator = (
  context: ClassDecoratorContext,
  validator: unknown,
) => {
  if (
    context.kind !== 'class' ||
    !context.name?.endsWith('Validator') ||
    !(validator as any).prototype.getScope
  ) {
    throw new ValidatorDecoratorException(
      `Validator decorator can only be used on validator classes. ${context.name} must end with Validator keyword and implement IValidator interface.`,
    );
  }
};

const ensureIsAssert = (
  context: ClassDecoratorContext,
  assert: unknown,
) => {
  if (
    context.kind !== 'class' ||
    !context.name?.startsWith('Assert') ||
    !(assert as any).prototype.validate
  ) {
    throw new ValidatorDecoratorException(
      `Assert decorator can only be used on assert classes. ${context.name} must start with Assert keyword implement IAssert interface.`,
    );
  }
};
