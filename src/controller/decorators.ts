import { container } from '../container/container';
import { pathToRegexp } from '../helper';
import { trim } from '../helper/trim';
import type { IMiddleware, MiddlewareEventType } from '../middleware/types';
import { ERole } from '../security/types';
import type { DecoratorScopeType } from '../types';
import type { IValidator, ValidatorScopeType } from '../validation/types';
import { ControllerDecoratorException } from './ControllerDecoratorException';
import { ControllerContainer } from './container';
import type { ControllerMethodType, ControllerRouteConfigType } from './types';

const path = (
  path: string | string[],
  method: ControllerMethodType | ControllerMethodType[] | '*',
  config?: Omit<
    ControllerRouteConfigType,
    'name' | 'value' | 'path' | 'regexp' | 'method'
  > & {
    scope?: DecoratorScopeType;
  },
): ClassDecorator => {
  return (controller: any) => {
    ensureIsController(controller);
    const name = controller.prototype.constructor.name;
    ensureInitialData(controller, { name });

    if (config?.scope === 'singleton') {
      container.bind(controller).toSelf().inSingletonScope();
    } else {
      container.bind(controller).toSelf().inTransientScope();
    }

    if (config) {
      config.scope = undefined;
    }

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
    definition.method = (Array.isArray(method) ? method : [method]).map(
      (m) => m.toUpperCase() as ControllerMethodType,
    );
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
  },
): ClassDecorator => {
  return (controller: any) => {
    ensureIsController(controller);
    const name = controller.prototype.constructor.name;
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
): ClassDecorator => {
  return (controller: any) => {
    ensureIsController(controller);
    const name = controller.prototype.constructor.name;
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

const host = (
  host: (string | RegExp) | (string | RegExp)[],
): ClassDecorator => {
  return (controller: any) => {
    ensureIsController(controller);
    const name = controller.prototype.constructor.name;
    ensureInitialData(controller, { name });

    const definition = ControllerContainer.get(
      name,
    ) as Required<ControllerRouteConfigType>;

    definition.host.push(...(Array.isArray(host) ? host : [host]));

    ControllerContainer.add(name, definition);
  };
};

const ip = (ip: (string | RegExp) | (string | RegExp)[]): ClassDecorator => {
  return (controller: any) => {
    ensureIsController(controller);
    const name = controller.prototype.constructor.name;
    ensureInitialData(controller, { name });

    const definition = ControllerContainer.get(
      name,
    ) as Required<ControllerRouteConfigType>;

    definition.ip.push(...(Array.isArray(ip) ? ip : [ip]));

    ControllerContainer.add(name, definition);
  };
};

const setRole = (roles: ERole[]): (() => ClassDecorator) => {
  return (): ClassDecorator => {
    return (controller: any) => {
      ensureIsController(controller);
      const name = controller.prototype.constructor.name;
      ensureInitialData(controller, { name });

      const definition = ControllerContainer.get(
        name,
      ) as Required<ControllerRouteConfigType>;

      definition.roles = roles;

      ControllerContainer.add(name, definition);
    };
  };
};

const notFound = (): ClassDecorator => {
  return (controller: any) => {
    const name = 'NotFoundController';

    if (
      controller.prototype.constructor.name !== 'NotFoundController' ||
      !controller.prototype.action
    ) {
      throw new ControllerDecoratorException(
        'NotFound decorator can only be used on NotFoundController class and implement IController interface.',
      );
    }

    ensureInitialData(controller, { name });

    const definition = ControllerContainer.get(
      name,
    ) as Required<ControllerRouteConfigType>;

    definition.path = [];
    definition.regexp = [];
    definition.method = [];
    definition.roles = [];
    definition.middlewares = [];
    definition.validators = [];
    definition.value = new controller();

    ControllerContainer.add(name, definition);
  };
};

const serverException = (): ClassDecorator => {
  return (controller: any) => {
    const name = 'ServerExceptionController';

    if (
      controller.prototype.constructor.name !== 'ServerExceptionController' ||
      !controller.prototype.action
    ) {
      throw new ControllerDecoratorException(
        'ServerException decorator can only be used on ServerExceptionController class and implement IController interface.',
      );
    }

    ensureInitialData(controller, { name });

    const definition = ControllerContainer.get(
      name,
    ) as Required<ControllerRouteConfigType>;

    definition.path = [];
    definition.regexp = [];
    definition.method = [];
    definition.roles = [];
    definition.middlewares = [];
    definition.validators = [];
    definition.value = new controller();

    ControllerContainer.add(name, definition);
  };
};

const setMethod = (
  methods: ControllerMethodType[],
): ((
  path: string,
  config?: { scope?: DecoratorScopeType },
) => ClassDecorator) => {
  return (
    path: string,
    config?: { scope?: DecoratorScopeType },
  ): ClassDecorator => {
    return (controller: any) => {
      ensureIsController(controller);
      const name = controller.prototype.constructor.name;
      ensureInitialData(controller, { name });

      if (config?.scope === 'singleton') {
        container.bind(controller).toSelf().inSingletonScope();
      } else {
        container.bind(controller).toSelf().inTransientScope();
      }

      const definition = ControllerContainer.get(
        name,
      ) as Required<ControllerRouteConfigType>;

      definition.path = [path];
      definition.regexp = [pathToRegexp(path)];
      definition.method = methods;

      ControllerContainer.add(name, definition);
    };
  };
};

export const Route: Record<string, any> = {
  path,
  host,
  ip,
  middleware,
  validator,
  delete: setMethod(['DELETE']),
  head: setMethod(['HEAD']),
  get: setMethod(['GET']),
  options: setMethod(['OPTIONS']),
  patch: setMethod(['PATCH']),
  post: setMethod(['POST']),
  put: setMethod(['PUT']),
  notFound,
  serverException,
  role: {
    anonymous: setRole([]),
    user: setRole([ERole.USER]),
    admin: setRole([ERole.ADMIN]),
    master: setRole([ERole.MASTER]),
  },
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
