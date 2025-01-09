import { container } from '@/container/container.ts';
import type { DecoratorScopeType } from '@/types.ts';
import { MiddlewareDecoratorException } from './MiddlewareDecoratorException.ts';

export const middleware = (options?: {
  scope?: DecoratorScopeType;
}): ClassDecorator => {
  return (middleware: any) => {
    const name = middleware.prototype.constructor.name;
    ensureIsMiddleware(name, middleware);

    if (options?.scope === 'request') {
      container.bind(middleware).toSelf().inRequestScope();
    } else if (options?.scope === 'transient') {
      container.bind(middleware).toSelf().inTransientScope();
    } else {
      container.bind(middleware).toSelf().inSingletonScope();
    }
  };
};

const ensureIsMiddleware = (name: string, middleware: any): void => {
  if (
    !name.endsWith('Middleware') ||
    !middleware.prototype.execute ||
    !middleware.prototype.getScope ||
    !middleware.prototype.getOrder
  ) {
    throw new MiddlewareDecoratorException(
      `Middleware decorator can only be used on middleware classes. ${name} must end with Middleware keyword and implement IMiddleware interface.`,
    );
  }
};
