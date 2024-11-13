import { container } from '@/container/Container.ts';
import { ValidatorDecoratorException } from '@/validation/ValidatorDecoratorException.ts';

export const validator = () => {
  return (service: unknown, context: ClassDecoratorContext) => {
    ensureIsValidator(context);

    container.add(context.name!, service, {
      scope: 'validator',
      singleton: true,
      instance: false,
    });
  };
};

const ensureIsValidator = (context: ClassDecoratorContext) => {
  if (context.kind !== 'class' || !context.name?.endsWith('Validator')) {
    throw new ValidatorDecoratorException(
      'Validator decorator can only be used on validator classes',
    );
  }
};
