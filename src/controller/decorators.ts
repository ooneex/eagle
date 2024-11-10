import {
  type ControllerOptionsType,
  EScope,
  type IController,
  MethodType,
} from "@/controller/types.ts";
import { Store } from "@/controller/store.ts";
import { DecoratorException } from "@/controller/DecoratorException.ts";

export const Delete = (path?: string) => {
  return (controller: IController, context: ClassDecoratorContext) => {
    registerMethod(controller, context, "DELETE", path);
  };
};

export const Get = (path?: string) => {
  return (controller: IController, context: ClassDecoratorContext) => {
    registerMethod(controller, context, "GET", path);
  };
};

export const Head = (path?: string) => {
  return (controller: IController, context: ClassDecoratorContext) => {
    registerMethod(controller, context, "HEAD", path);
  };
};

export const Options = (path?: string) => {
  return (controller: IController, context: ClassDecoratorContext) => {
    registerMethod(controller, context, "OPTIONS", path);
  };
};

export const Patch = (path?: string) => {
  return (controller: IController, context: ClassDecoratorContext) => {
    registerMethod(controller, context, "PATCH", path);
  };
};

export const Post = (path?: string) => {
  return (controller: IController, context: ClassDecoratorContext) => {
    registerMethod(controller, context, "POST", path);
  };
};

export const Put = (path?: string) => {
  return (controller: IController, context: ClassDecoratorContext) => {
    registerMethod(controller, context, "PUT", path);
  };
};

export const Path = (path: string) => {
  return (controller: IController, context: ClassDecoratorContext) => {
    ensureIsController(context);
    ensureInitialData(context, controller);

    if (context.name) {
      const config = Store.get(context.name) ?? {};
      if (!config.paths?.includes(path)) {
        config.paths?.push(path);
        Store.set(context.name, config);
      }
    }
  };
};

export const Host = (host: string | RegExp) => {
  return (controller: IController, context: ClassDecoratorContext) => {
    ensureIsController(context);
    ensureInitialData(context, controller);

    if (context.name) {
      const config = Store.get(context.name) ?? {};
      if (!config.hosts?.includes(host)) {
        config.hosts?.push(host);
        Store.set(context.name, config);
      }
    }
  };
};

export const Scope = (scope: EScope) => {
  return (controller: IController, context: ClassDecoratorContext) => {
    ensureIsController(context);
    ensureInitialData(context, controller);

    if (context.name) {
      const config = Store.get(context.name) ?? {};
      config.scope = scope;
      Store.set(context.name, config);
    }
  };
};

const registerMethod = (
  controller: IController,
  context: ClassDecoratorContext,
  method: MethodType,
  path?: string,
) => {
  ensureIsController(context);
  ensureInitialData(context, controller);

  if (context.name) {
    const config = Store.get(context.name) ?? {};
    if (!config.methods?.includes(method)) {
      config.methods?.push(method);
      Store.set(context.name, config);
    }

    if (path) {
      if (!config.paths?.includes(path)) {
        config.paths?.push(path);
        Store.set(context.name, config);
      }
    }
  }
};

const ensureInitialData = (
  context: ClassDecoratorContext,
  controller: IController,
) => {
  let config: ControllerOptionsType | null = null;

  if (context.name) {
    config = Store.get(context.name) ?? null;

    if (!config) {
      config = {
        methods: [],
        paths: [],
        hosts: [],
        scope: EScope.DEFAULT,
        controller: controller,
      };

      Store.set(context.name, config);
    }
  }
};

const ensureIsController = (context: ClassDecoratorContext) => {
  if (context.kind !== "class") {
    throw new DecoratorException(
      "Controller decorator can only be used on controller classes",
    );
  }
};
