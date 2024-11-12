import { container } from '@/container/Container.ts';
import { ControllerContainer } from '@/controller/container.ts';
import { DecoratorException } from '@/controller/DecoratorException.ts';
import {
  ControllerMethodType,
  DecoratorControllerType,
} from '@/controller/types.ts';
import {
  NOT_FOUND_CONTROLLER_KEY,
  pathToRegexp,
  SERVER_EXCEPTION_CONTROLLER_KEY,
} from '@/controller/utils.ts';
import { trim } from '@/helper/trim.ts';

type ControllerType = DecoratorControllerType;

export const Delete = (path: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'DELETE', path);
  };
};

export const Get = (path: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'GET', path);
  };
};

export const Head = (path: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'HEAD', path);
  };
};

export const Options = (path: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'OPTIONS', path);
  };
};

export const Patch = (path: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'PATCH', path);
  };
};

export const Post = (path: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'POST', path);
  };
};

export const Put = (path: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'PUT', path);
  };
};

export const Path = (path: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    ensureIsController(context);
    ensureInitialData(context, controller);

    if (context.name) {
      const config = ControllerContainer.get(context.name)!;
      if (!config.paths?.includes(path)) {
        path = `/${trim(path, '/')}`;
        const regexp = pathToRegexp(path);
        config.paths?.push(path);
        config.regexp?.push(regexp);
        ControllerContainer.add(context.name, config);
      }
    }
  };
};

export const Host = (host: string | RegExp) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    ensureIsController(context);
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
    ensureIsController(context);
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
    ensureIsController(context);

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
    ensureIsController(context);

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
) => {
  ensureIsController(context);
  ensureInitialData(context, controller);

  if (context.name) {
    const config = ControllerContainer.get(context.name)!;
    if (!config.methods?.includes(method)) {
      config.methods?.push(method);
      ControllerContainer.add(context.name, config);
    }

    if (path) {
      if (!config.paths?.includes(path)) {
        path = `/${trim(path, '/')}`;
        const regexp = pathToRegexp(path);
        config.paths?.push(path);
        config.regexp?.push(regexp);
        ControllerContainer.add(context.name, config);
      }
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
    });

    container.add(context.name, controller, {
      scope: 'controller',
      singleton: false,
      instance: false,
    });
  }
};

const ensureIsController = (context: ClassDecoratorContext) => {
  if (context.kind !== 'class' || !context.name?.endsWith('Controller')) {
    throw new DecoratorException(
      'Controller decorator can only be used on controller classes',
    );
  }
};
