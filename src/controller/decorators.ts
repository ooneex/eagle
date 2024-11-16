import { container } from '@/container/Container.ts';
import { ControllerContainer } from '@/controller/container.ts';
import { DecoratorException } from '@/controller/DecoratorException.ts';
import { ControllerMethodType } from '@/controller/types.ts';
import {
  NOT_FOUND_CONTROLLER_KEY,
  pathToRegexp,
  SERVER_EXCEPTION_CONTROLLER_KEY,
} from '@/controller/utils.ts';
import { trim } from '@/helper/trim.ts';
import { IValidator } from '@/validation/types.ts';

type ControllerType = any;

export const Delete = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'DELETE', path, validators);
  };
};

export const Get = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'GET', path, validators);
  };
};

export const Head = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'HEAD', path, validators);
  };
};

export const Options = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'OPTIONS', path, validators);
  };
};

export const Patch = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'PATCH', path, validators);
  };
};

export const Post = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'POST', path, validators);
  };
};

export const Put = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType) => {
    registerMethod(controller, 'PUT', path, validators);
  };
};

export const Host = (host: string | RegExp) => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);
    ensureInitialData(name, controller);

    if (name) {
      const config = ControllerContainer.get(name)!;
      if (!config.hosts?.includes(host)) {
        config.hosts?.push(host);
        ControllerContainer.add(name, config);
      }
    }
  };
};

export const Ip = (ip: string | RegExp) => {
  return (controller: ControllerType) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);
    ensureInitialData(name, controller);

    if (name) {
      const config = ControllerContainer.get(name)!;
      if (!config.ips?.includes(ip)) {
        config.ips?.push(ip);
        ControllerContainer.add(name, config);
      }
    }
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
  validators?: IValidator[],
) => {
  const name = controller.prototype.constructor.name;
  ensureIsController(name, controller);
  ensureInitialData(name, controller);

  if (name) {
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

    if (validators) {
      config.validators = validators;
      ControllerContainer.add(name, config);
    }
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
