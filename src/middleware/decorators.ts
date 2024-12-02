import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { MiddlewareDecoratorException } from './MiddlewareDecoratorException.ts';

/**
 * Decorator factory that registers a middleware class with the container.
 * @param options Configuration options for the middleware registration
 * @param options.scope The container scope to register the middleware in. Defaults to 'middleware'
 * @param options.singleton Whether the middleware should be registered as a singleton. Defaults to true
 * @returns A decorator function that registers the middleware class
 */
export const middleware = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}) => {
  return (middleware: any) => {
    const name = middleware.prototype.constructor.name;
    ensureIsMiddleware(name, middleware);

    container.add(name, middleware, {
      scope: options?.scope ?? 'middleware',
      singleton: options?.singleton ?? true,
      instance: false,
    });
  };
};

/**
 * Validates that a class is a valid middleware implementation
 * @param name The name of the middleware class
 * @param validator The middleware class to validate
 * @throws {MiddlewareDecoratorException} If the class is not a valid middleware implementation
 */
const ensureIsMiddleware = (name: string, validator: any) => {
  if (
    !name?.endsWith('Middleware') ||
    !validator.prototype.execute ||
    !validator.prototype.getScope ||
    !validator.prototype.getOrder
  ) {
    throw new MiddlewareDecoratorException(
      `Middleware decorator can only be used on middleware classes. ${name} must end with Middleware keyword and implement IMiddleware interface.`,
    );
  }
};
