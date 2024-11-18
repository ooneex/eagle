import { container } from '../container/Container.ts';
import { ServiceDecoratorException } from './ServiceDecoratorException.ts';

export const service = () => {
  return (service: any) => {
    const name = service.prototype.constructor.name;
    ensureIsService(name);

    container.add(name!, service, {
      scope: 'service',
      singleton: true,
      instance: false,
    });
  };
};

const ensureIsService = (name: string) => {
  if (!name.endsWith('Service')) {
    throw new ServiceDecoratorException(
      `Service decorator can only be used on service classes. ${name} must end with Service keyword.`,
    );
  }
};
