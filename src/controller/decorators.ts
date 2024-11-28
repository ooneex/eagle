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

type ControllerType = any;

export const Delete = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'DELETE', path, config);
  };
};

export const Get = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'GET', path, config);
  };
};

export const Head = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'HEAD', path, config);
  };
};

export const Options = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'OPTIONS', path, config);
  };
};

export const Patch = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'PATCH', path, config);
  };
};

export const Post = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'POST', path, config);
  };
};

export const Put = (
  path: string,
  config?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'PUT', path, config);
  };
};

export const Host = (host: string | RegExp) => {
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

export const Ip = (ip: string | RegExp) => {
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

export const Public = () => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);
    ensureInitialData(name, controller);

    const config = ControllerContainer.get(name)!;
    config.roles = [];
    ControllerContainer.add(name, config);
  };
};

export const Admin = () => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);
    ensureInitialData(name, controller);

    const config = ControllerContainer.get(name)!;
    config.roles = [ERole.ADMIN];
    ControllerContainer.add(name, config);
  };
};

export const SuperAdmin = () => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);
    ensureInitialData(name, controller);

    const config = ControllerContainer.get(name)!;
    config.roles = [ERole.SUPER_ADMIN];
    ControllerContainer.add(name, config);
  };
};

export const NotFound = () => {
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

export const ServerException = () => {
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

const registerMethod = (
  controller: ControllerType,
  method: ControllerMethodType,
  path: string,
  options?: { validators?: IValidator[]; middlewares?: IMiddleware[] },
) => {
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

const ensureInitialData = (name: string, controller: ControllerType) => {
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

const ensureIsController = (name: string, controller: ControllerType) => {
  if (
    !name?.endsWith('Controller') ||
    !controller.prototype.action
  ) {
    throw new DecoratorException(
      'Controller decorator can only be used on controller classes',
    );
  }
};
