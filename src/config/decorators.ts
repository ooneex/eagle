import { ConfigDecoratorException } from '@/config/ConfigDecoratorException.ts';
import { container } from '@/container/Container.ts';

export const config = () => {
  return (service: unknown, context: ClassDecoratorContext) => {
    ensureIsConfig(context);

    container.add(context.name!, service, {
      scope: 'service',
      singleton: true,
      instance: false,
    });
  };
};

const ensureIsConfig = (context: ClassDecoratorContext) => {
  if (context.kind !== 'class' || !context.name?.endsWith('Config')) {
    throw new ConfigDecoratorException(
      'Config decorator can only be used on config classes',
    );
  }
};
