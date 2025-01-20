import { container } from '../container';
import type { DecoratorScopeType } from '../types';
import { MiddlewareDecoratorException } from './MiddlewareDecoratorException';
import { MiddlewareContainer } from './container';
import type { MiddlewareEventType } from './types';

export const middleware = (options: {
  scope?: DecoratorScopeType;
  on: MiddlewareEventType;
  priority?: number;
}): ClassDecorator => {
  return (middleware: any) => {
    const name = middleware.prototype.constructor.name;
    ensureIsMiddleware(name, middleware);

    if (options?.scope === 'transient') {
      container.bind(middleware).toSelf().inTransientScope();
    } else {
      container.bind(middleware).toSelf().inSingletonScope();
    }

    MiddlewareContainer.get(options.on)?.push({
      name,
      value: middleware,
      priority: options?.priority ?? 0,
    });
  };
};

const ensureIsMiddleware = (name: string, middleware: any): void => {
  if (!name.endsWith('Middleware') || !middleware.prototype.next) {
    throw new MiddlewareDecoratorException(
      `Middleware decorator can only be used on middleware classes. ${name} must end with Middleware keyword and implement IMiddleware interface.`,
    );
  }
};
