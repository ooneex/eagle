import { container } from '../container/Container.ts';
import { trim } from '../helper/trim.ts';
import { IMiddleware } from '../middleware/types.ts';
import { ERole } from '../security/types.ts';
import { IValidator } from '../validation/types.ts';
import { ControllerContainer } from './container.ts';
import { DecoratorException } from './DecoratorException.ts';
import { ControllerMethodType } from './types.ts';
import {
  NOT_FOUND_CONTROLLER_KEY,
  pathToRegexp,
  SERVER_EXCEPTION_CONTROLLER_KEY,
} from './utils.ts';

/** Generic controller type */
type ControllerType = any;

/**
 * Decorator for DELETE HTTP method routes
 * @param path - URL path to handle
 * @param config - Optional configuration including validators and middlewares
 */
export const Delete = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
): ClassDecorator => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'DELETE', path, config);
  };
};

/**
 * Decorator for GET HTTP method routes
 * @param path - URL path to handle
 * @param config - Optional configuration including validators and middlewares
 */
export const Get = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
): ClassDecorator => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'GET', path, config);
  };
};

/**
 * Decorator for HEAD HTTP method routes
 * @param path - URL path to handle
 * @param config - Optional configuration including validators and middlewares
 */
export const Head = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
): ClassDecorator => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'HEAD', path, config);
  };
};

/**
 * Decorator for OPTIONS HTTP method routes
 * @param path - URL path to handle
 * @param config - Optional configuration including validators and middlewares
 */
export const Options = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
): ClassDecorator => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'OPTIONS', path, config);
  };
};

/**
 * Decorator for PATCH HTTP method routes
 * @param path - URL path to handle
 * @param config - Optional configuration including validators and middlewares
 */
export const Patch = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
): ClassDecorator => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'PATCH', path, config);
  };
};

/**
 * Decorator for POST HTTP method routes
 * @param path - URL path to handle
 * @param config - Optional configuration including validators and middlewares
 */
export const Post = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
): ClassDecorator => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'POST', path, config);
  };
};

/**
 * Decorator for PUT HTTP method routes
 * @param path - URL path to handle
 * @param config - Optional configuration including validators and middlewares
 */
export const Put = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
): ClassDecorator => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'PUT', path, config);
  };
};

/**
 * Decorator to restrict controller to specific host
 * @param host - Host string or RegExp to match
 */
export const Host = (host: string | RegExp): ClassDecorator => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);
    ensureInitialData(name, controller);

    const config = ControllerContainer.get(name)!;
    if (!config.hosts?.includes(host)) {
      config.hosts?.push(host);
      ControllerContainer.add(name, config);
    }
  };
};

/**
 * Decorator to restrict controller to specific IP addresses
 * @param ip - IP address string or RegExp to match
 */
export const Ip = (ip: string | RegExp): ClassDecorator => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);
    ensureInitialData(name, controller);

    const config = ControllerContainer.get(name)!;
    if (!config.ips?.includes(ip)) {
      config.ips?.push(ip);
      ControllerContainer.add(name, config);
    }
  };
};

/**
 * Decorator to mark controller as publicly accessible
 */
export const Public = (): ClassDecorator => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);
    ensureInitialData(name, controller);

    const config = ControllerContainer.get(name)!;
    config.roles = [];
    ControllerContainer.add(name, config);
  };
};

/**
 * Decorator to restrict controller to admin role
 */
export const Admin = (): ClassDecorator => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);
    ensureInitialData(name, controller);

    const config = ControllerContainer.get(name)!;
    config.roles = [ERole.ADMIN];
    ControllerContainer.add(name, config);
  };
};

/**
 * Decorator to restrict controller to super admin role
 */
export const SuperAdmin = (): ClassDecorator => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);
    ensureInitialData(name, controller);

    const config = ControllerContainer.get(name)!;
    config.roles = [ERole.SUPER_ADMIN];
    ControllerContainer.add(name, config);
  };
};

/**
 * Decorator to mark controller as not found handler
 */
export const NotFound = (): ClassDecorator => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);

    ControllerContainer.add(NOT_FOUND_CONTROLLER_KEY, {
      name: NOT_FOUND_CONTROLLER_KEY,
    });

    container.add(NOT_FOUND_CONTROLLER_KEY, controller, {
      scope: 'controller',
      singleton: false,
      instance: false,
    });
  };
};

/**
 * Decorator to mark controller as server exception handler
 */
export const ServerException = (): ClassDecorator => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);

    ControllerContainer.add(SERVER_EXCEPTION_CONTROLLER_KEY, {
      name: SERVER_EXCEPTION_CONTROLLER_KEY,
    });

    container.add(SERVER_EXCEPTION_CONTROLLER_KEY, controller, {
      scope: 'controller',
      singleton: false,
      instance: false,
    });
  };
};

/**
 * Registers an HTTP method handler for a controller
 */
const registerMethod = (
  controller: ControllerType,
  method: ControllerMethodType,
  path: string,
  options?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
): void => {
  const name = controller.prototype.constructor.name;
  ensureIsController(name, controller);
  ensureInitialData(name, controller);

  const config = ControllerContainer.get(name)!;
  config.methods = [method];
  ControllerContainer.add(name, config);

  if (path) {
    path = `/${trim(path, '/')}`;
    const regexp = pathToRegexp(path);
    config.paths = [path];
    config.regexp = [regexp];
    ControllerContainer.add(name, config);
  }

  if (options?.validators) {
    config.validators = options.validators;
    ControllerContainer.add(name, config);
  }

  if (options?.middlewares) {
    config.middlewares = options.middlewares;
    ControllerContainer.add(name, config);
  }
};

/**
 * Ensures controller has initial configuration data
 */
const ensureInitialData = (name: string, controller: ControllerType): void => {
  if (name && !ControllerContainer.has(name)) {
    ControllerContainer.add(name, {
      name,
      methods: [],
      paths: [],
      regexp: [],
      hosts: [],
      ips: [],
      validators: [],
      middlewares: [],
      roles: [ERole.USER],
    });

    container.add(name, controller, {
      scope: 'controller',
      singleton: false,
      instance: false,
    });
  }
};

/**
 * Validates that decorator is applied to a controller class
 */
const ensureIsController = (name: string, controller: ControllerType): void => {
  if (
    !name?.endsWith('Controller') ||
    !controller.prototype.action
  ) {
    throw new DecoratorException(
      'Controller decorator can only be used on controller classes',
    );
  }
};
