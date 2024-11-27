import { container } from '../container/Container.ts';
import { MiddlewareDecoratorException } from './MiddlewareDecoratorException.ts';

export const middleware = () => {
  return (middleware: any) => {
    const name = middleware.prototype.constructor.name;
    ensureIsMiddleware(name, middleware);

    container.add(name, new middleware(), {
      scope: 'middleware',
      singleton: true,
      instance: true,
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
