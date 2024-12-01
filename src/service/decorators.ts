import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { ServiceDecoratorException } from './ServiceDecoratorException.ts';

export const service = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}) => {
  return (service: any) => {
    const name = service.prototype.constructor.name;
    ensureIsService(name);

    container.add(name!, service, {
      scope: options?.scope ?? 'service',
      singleton: options?.singleton ?? true,
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
