import { container } from '@/container/container.ts';
import { pathToRegexp } from '@/helper';
import { trim } from '@/helper/trim.ts';
import type { DecoratorScopeType } from '@/types.ts';
import { ControllerDecoratorException } from './ControllerDecoratorException.ts';
import { ControllerContainer } from './container.ts';
import type {
  ControllerMethodType,
  ControllerPathConfigType,
} from './types.ts';

export const Route = (
  path: string | string[],
  method: ControllerMethodType | ControllerMethodType[] | '*',
  config?: Omit<
    ControllerPathConfigType,
    'name' | 'value' | 'paths' | 'regexp' | 'methods'
  > & {
    name?: string;
    scope?: DecoratorScopeType;
  },
): ClassDecorator => {
  return (controller: any) => {
    const name = controller.prototype.constructor.name;
    ensureIsController(name, controller);

    if (config?.scope === 'singleton') {
      container.bind(controller).toSelf().inSingletonScope();
    } else if (config?.scope === 'transient') {
      container.bind(controller).toSelf().inTransientScope();
    } else {
      container.bind(controller).toSelf().inRequestScope();
    }

    // biome-ignore lint/performance/noDelete: trust me
    delete config?.scope;

    if (method === '*') {
      method = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
    }

    const paths = (Array.isArray(path) ? path : [path]).map(
      (p) => `/${trim(p, '/')}`,
    );

    ControllerContainer.add({
      value: controller,
      paths,
      methods: Array.isArray(method) ? method : [method],
      ...(config ?? {}),
      name: config?.name ?? name,
      regexp: paths.map(pathToRegexp),
    });
  };
};

const ensureIsController = (name: string, controller: any): void => {
  if (!name.endsWith('Controller') || !controller.prototype.action) {
    throw new ControllerDecoratorException(
      `Controller decorator can only be used on controller classes. ${name} must end with Controller keyword and implement IController interface.`,
    );
  }
};
