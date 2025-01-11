import { container } from '@/container/container.ts';
import { pathToRegexp } from '@/helper';
import { trim } from '@/helper/trim.ts';
import type { IMiddleware, MiddlewareEventType } from '@/middleware/types.ts';
import { ERole } from '@/security/types.ts';
import type { DecoratorScopeType } from '@/types.ts';
import type { IValidator, ValidatorScopeType } from '@/validation/types.ts';
import { ControllerDecoratorException } from './ControllerDecoratorException.ts';
import { ControllerContainer } from './container.ts';
import type {
  ControllerMethodType,
  ControllerRouteConfigType,
} from './types.ts';

const path = (
  path: string | string[],
  method: ControllerMethodType | ControllerMethodType[] | '*',
  config?: Omit<
    ControllerRouteConfigType,
    'name' | 'value' | 'path' | 'regexp' | 'method'
  > & {
    name?: string;
    scope?: DecoratorScopeType;
  },
): ClassDecorator => {
  return (controller: any) => {
    ensureIsController(controller);
    const name = config?.name ?? controller.prototype.constructor.name;
    ensureInitialData(controller, { name });

    if (config?.scope === 'singleton') {
      container.bind(controller).toSelf().inSingletonScope();
    } else if (config?.scope === 'transient') {
      container.bind(controller).toSelf().inTransientScope();
    } else {
      container.bind(controller).toSelf().inRequestScope();
    }

    // biome-ignore lint/performance/noDelete: trust me
    delete config?.scope;

    const definition = ControllerContainer.get(
      name,
    ) as Required<ControllerRouteConfigType>;

    if (method === '*') {
      method = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
    }

    const paths = (Array.isArray(path) ? path : [path]).map(
      (p) => `/${trim(p, '/')}`,
    );
    definition.path = paths;
    definition.regexp = paths.map(pathToRegexp);
    definition.method = Array.isArray(method) ? method : [method];
    if (config?.host) {
      definition.host = Array.isArray(config.host)
        ? config.host
        : [config.host];
    }
    if (config?.ip) {
      definition.ip = Array.isArray(config.ip) ? config.ip : [config.ip];
    }

    if (config?.validators) {
      definition.validators = config.validators;
    }

    if (config?.middlewares) {
      definition.middlewares = config.middlewares;
    }

    if (config?.roles) {
      definition.roles = config.roles;
    }

    ControllerContainer.add(name, definition);
  };
};

const middleware = (
  event: Extract<MiddlewareEventType, 'request' | 'response'>,
  middleware: IMiddleware,
  config?: {
    priority?: number;
    name?: string;
  },
): ClassDecorator => {
  return (controller: any) => {
    ensureIsController(controller);
    const name = config?.name ?? controller.prototype.constructor.name;
    ensureInitialData(controller, { name });

    const definition = ControllerContainer.get(
      name,
    ) as Required<ControllerRouteConfigType>;

    definition.middlewares.push({
      event,
      value: middleware,
      priority: config?.priority,
    });

    ControllerContainer.add(name, definition);
  };
};

const validator = (
  scope: ValidatorScopeType,
  validator: IValidator,
  config?: {
    name?: string;
  },
): ClassDecorator => {
  return (controller: any) => {
    ensureIsController(controller);
    const name = config?.name ?? controller.prototype.constructor.name;
    ensureInitialData(controller, { name });

    const definition = ControllerContainer.get(
      name,
    ) as Required<ControllerRouteConfigType>;

    definition.validators.push({
      scope,
      value: validator,
    });

    ControllerContainer.add(name, definition);
  };
};

export const Route = {
  path,
  middleware,
  validator,
};

const ensureIsController = (controller: any): void => {
  const name = controller.prototype.constructor.name;

  if (!name.endsWith('Controller') || !controller.prototype.action) {
    throw new ControllerDecoratorException(
      `Controller decorator can only be used on controller classes. ${name} must end with Controller keyword and implement IController interface.`,
    );
  }
};

const ensureInitialData = (controller: any, config: { name: string }): void => {
  const name = config.name;

  if (!ControllerContainer.has(name)) {
    ControllerContainer.add(name, {
      name,
      method: [],
      path: [],
      regexp: [],
      host: [],
      ip: [],
      validators: [],
      middlewares: [],
      roles: [ERole.USER],
      value: controller,
    });
  }
};
