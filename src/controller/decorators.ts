import { DecoratorException } from '@/controller/DecoratorException.ts';
import { ControllerStore } from '@/controller/store.ts';
import {
  ControllerMethodType,
  DecoratorControllerType,
} from '@/controller/types.ts';

type ControllerType = DecoratorControllerType;

export const Delete = (path?: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'DELETE', path);
  };
};

export const Get = (path?: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'GET', path);
  };
};

export const Head = (path?: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'HEAD', path);
  };
};

export const Options = (path?: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'OPTIONS', path);
  };
};

export const Patch = (path?: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'PATCH', path);
  };
};

export const Post = (path?: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'POST', path);
  };
};

export const Put = (path?: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    registerMethod(controller, context, 'PUT', path);
  };
};

export const Path = (path: string) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    ensureIsController(context);
    ensureInitialData(context, controller);

    if (context.name) {
      const config = ControllerStore.get(context.name) ?? {};
      if (!config.paths?.includes(path)) {
        config.paths?.push(path);
        ControllerStore.add(context.name, config);
      }
    }
  };
};

export const Host = (host: string | RegExp) => {
  return (controller: ControllerType, context: ClassDecoratorContext) => {
    ensureIsController(context);
    ensureInitialData(context, controller);

    if (context.name) {
      const config = ControllerStore.get(context.name) ?? {};
      if (!config.hosts?.includes(host)) {
        config.hosts?.push(host);
        ControllerStore.add(context.name, config);
      }
    }
  };
};

const registerMethod = (
  controller: ControllerType,
  context: ClassDecoratorContext,
  method: ControllerMethodType,
  path?: string,
) => {
  ensureIsController(context);
  ensureInitialData(context, controller);

  if (context.name) {
    const config = ControllerStore.get(context.name) ?? {};
    if (!config.methods?.includes(method)) {
      config.methods?.push(method);
      ControllerStore.add(context.name, config);
    }

    if (path) {
      if (!config.paths?.includes(path)) {
        config.paths?.push(path);
        ControllerStore.add(context.name, config);
      }
    }
  }
};

const ensureInitialData = (
  context: ClassDecoratorContext,
  controller: ControllerType,
) => {
  if (context.name && !ControllerStore.has(context.name)) {
    ControllerStore.add(context.name, {
      methods: [],
      paths: [],
      hosts: [],
      controller: controller,
    });
  }
};

const ensureIsController = (context: ClassDecoratorContext) => {
  if (context.kind !== 'class') {
    throw new DecoratorException(
      'Controller decorator can only be used on controller classes',
    );
  }
};
