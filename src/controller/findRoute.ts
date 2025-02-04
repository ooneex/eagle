import { match } from 'path-to-regexp';
import { ControllerNotFoundException } from './ControllerNotFoundException';
import { ControllerContainer } from './container';
import type {
  ControllerFindParamType,
  ControllerFindReturnType,
  ControllerMethodType,
} from './types';

export const findRoute = ({
  path,
  method,
  host,
  ip,
}: ControllerFindParamType): ControllerFindReturnType => {
  method = method.toUpperCase() as ControllerMethodType;

  const route = ControllerContainer.find((_, d) => {
    if (!d.method.includes(method.toUpperCase() as ControllerMethodType)) {
      return false;
    }

    if (!d.regexp?.[0].test(path)) {
      return false;
    }

    return true;
  });

  if (!route) {
    throw new ControllerNotFoundException(
      `Route ${path} with method ${method} not found`,
      {
        route: {
          request: {
            path,
            method,
            host,
            ip,
          },
        },
      },
    );
  }

  const result: ControllerFindReturnType = {
    name: route.value.name,
    value: route.value.value,
    path: route.value.path,
    regexp: route.value.regexp ?? [],
    method: route.value.method,
    host: route.value.host ?? [],
    ip: route.value.ip ?? [],
    validators: route.value.validators ?? [],
    middlewares: route.value.middlewares ?? [],
    roles: route.value.roles ?? [],
    params: {},
  };

  const data = {
    route: {
      definition: result,
      request: {
        path,
        method,
        host,
        ip,
      },
    },
  };

  const fn = match(result.path[0]);
  const matches = fn(path);
  if (matches) {
    result.params = matches.params as Record<string, any>;
  }

  if (host && result.host.length > 0) {
    const hostMatch = result.host.some((h) =>
      h instanceof RegExp ? h.test(host) : h === host,
    );

    if (!hostMatch) {
      throw new ControllerNotFoundException(
        `Host ${host} is not allowed for route ${path} with method ${method}`,
        data,
      );
    }
  }

  if (ip && result.ip.length > 0) {
    const ipMatch = result.ip.some((i) =>
      i instanceof RegExp ? i.test(ip) : i === ip,
    );

    if (!ipMatch) {
      throw new ControllerNotFoundException(
        `IP ${ip} is not allowed for route ${path} with method ${method}`,
        data,
      );
    }
  }

  return result;
};
