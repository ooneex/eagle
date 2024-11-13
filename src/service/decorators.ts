import { container } from '@/container/Container.ts';
import { ServiceDecoratorException } from '@/service/ServiceDecoratorException.ts';

export const service = () => {
  return (service: unknown, context: ClassDecoratorContext) => {
    ensureIsService(context);

    container.add(context.name!, service, {
      scope: 'service',
      singleton: true,
      instance: false,
    });
  };
};

const ensureIsService = (context: ClassDecoratorContext) => {
  if (context.kind !== 'class' || !context.name?.endsWith('Service')) {
    throw new ServiceDecoratorException(
      'Service decorator can only be used on service classes',
    );
  }
};
