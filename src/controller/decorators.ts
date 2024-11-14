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

type ControllerType = unknown;

export const Delete = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'DELETE', path, validators);
  };
};

export const Get = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'GET', path, validators);
  };
};

export const Head = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'HEAD', path, validators);
  };
};

export const Options = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'OPTIONS', path, validators);
  };
};

export const Patch = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'PATCH', path, validators);
  };
};

export const Post = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'POST', path, validators);
  };
};

export const Put = (path: string, validators?: IValidator[]) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'PUT', path, validators);
  };
};

export const Host = (host: string | RegExp) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    ensureIsController(context, controller);
    ensureInitialData(context, controller);

    if (context.name) {
      const config = ControllerContainer.get(context.name)!;
      if (!config.hosts?.includes(host)) {
        config.hosts?.push(host);
        ControllerContainer.add(context.name, config);
      }
    }
  };
};

export const Ip = (ip: string | RegExp) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    ensureIsController(context, controller);
    ensureInitialData(context, controller);

    if (context.name) {
      const config = ControllerContainer.get(context.name)!;
      if (!config.ips?.includes(ip)) {
        config.ips?.push(ip);
        ControllerContainer.add(context.name, config);
      }
    }
  };
};

export const NotFound = () => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    ensureIsController(context, controller);

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
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    ensureIsController(context, controller);

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
  context: ClassDecoratorContext,
  method: ControllerMethodType,
  path: string,
  validators?: IValidator[],
) => {
  ensureIsController(context, controller);
  ensureInitialData(context, controller);

  if (context.name) {
    const config = ControllerContainer.get(context.name)!;
    config.methods = [method];
    ControllerContainer.add(context.name, config);

    if (path) {
      path = `/${trim(path, '/')}`;
      const regexp = pathToRegexp(path);
      config.paths = [path];
      config.regexp = [regexp];
      ControllerContainer.add(context.name, config);
    }

    if (validators) {
      config.validators = validators;
      ControllerContainer.add(context.name, config);
    }
  }
};

const ensureInitialData = (
  context: ClassDecoratorContext,
  controller: ControllerType,
) => {
  if (context.name && !ControllerContainer.has(context.name)) {
    ControllerContainer.add(context.name, {
      name: context.name,
      methods: [],
      paths: [],
      regexp: [],
      hosts: [],
      ips: [],
      validators: [],
    });

    container.add(context.name, controller, {
      scope: 'controller',
      singleton: false,
      instance: false,
    });
  }
};

const ensureIsController = (
  context: ClassDecoratorContext,
  controller: ControllerType,
) => {
  if (
    context.kind !== 'class' ||
    !context.name?.endsWith('Controller') ||
    !(controller as any).prototype.action
  ) {
    throw new DecoratorException(
      'Controller decorator can only be used on controller classes',
    );
  }
};
