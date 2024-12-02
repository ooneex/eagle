import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { ServiceDecoratorException } from './ServiceDecoratorException.ts';

/**
 * Service decorator factory that registers a class as a service in the container.
 * @param options Configuration options for the service
 * @param options.scope The scope of the service instance (default: 'service')
 * @param options.singleton Whether the service should be a singleton (default: true)
 * @returns Class decorator function
 */
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

/**
 * Validates that a class name ends with 'Service'
 * @param name The class name to validate
 * @throws {ServiceDecoratorException} If the class name doesn't end with 'Service'
 */
const ensureIsService = (name: string) => {
  if (!name.endsWith('Service')) {
    throw new ServiceDecoratorException(
      `Service decorator can only be used on service classes. ${name} must end with Service keyword.`,
    );
  }
};
