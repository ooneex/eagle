import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { MiddlewareDecoratorException } from './MiddlewareDecoratorException.ts';

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
