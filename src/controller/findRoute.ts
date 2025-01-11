import { ControllerNotFoundException } from './ControllerNotFoundException.ts';
import { ControllerContainer } from './container.ts';
import type {
  ControllerFindParamType,
  ControllerFindReturnType,
  ControllerMethodType,
} from './types.ts';

export const findRoute = ({
  path,
  method,
  host,
  ip,
}: ControllerFindParamType): ControllerFindReturnType => {
  method = method.toUpperCase() as ControllerMethodType;

  const route = ControllerContainer.find((d) => {
    if (!d.method.includes(method)) {
      return false;
    }

    if (!d.regexp?.some((r) => r.test(path))) {
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
    name: route.name,
    value: route.value,
    path: route.path,
    regexp: route.regexp ?? [],
    method: route.method,
    host: route.host ?? [],
    ip: route.ip ?? [],
    validators: route.validators ?? [],
    middlewares: route.middlewares ?? [],
    roles: route.roles ?? [],
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

  for (const reg of result.regexp) {
    const matches = reg.exec(path);
    if (matches?.groups) {
      result.params = matches.groups;
    }
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
