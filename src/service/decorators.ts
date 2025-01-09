import { container } from '@/container/container.ts';
import type { DecoratorScopeType } from '@/types.ts';
import { ServiceDecoratorException } from './ServiceDecoratorException.ts';

export const service = (options?: {
  scope?: DecoratorScopeType;
}): ClassDecorator => {
  return (service: any) => {
    const name = service.prototype.constructor.name;
    ensureIsService(name);

    if (options?.scope === 'request') {
      container.bind(service).toSelf().inRequestScope();
    } else if (options?.scope === 'transient') {
      container.bind(service).toSelf().inTransientScope();
    } else {
      container.bind(service).toSelf().inSingletonScope();
    }
  };
};

const ensureIsService = (name: string): void => {
  if (!name.endsWith('Service')) {
    throw new ServiceDecoratorException(
      `Service decorator can only be used on service classes. ${name} must end with Service keyword.`,
    );
  }
};
