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
    if (!d.methods.includes(method)) {
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
    paths: route.paths,
    regexp: route.regexp ?? [],
    methods: route.methods,
    hosts: route.hosts ?? [],
    ips: route.ips ?? [],
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

  if (host && result.hosts.length > 0) {
    const hostMatch = result.hosts.some((h) =>
      h instanceof RegExp ? h.test(host) : h === host,
    );

    if (!hostMatch) {
      throw new ControllerNotFoundException(
        `Host ${host} is not allowed for route ${path} with method ${method}`,
        data,
      );
    }
  }

  if (ip && result.ips.length > 0) {
    const ipMatch = result.ips.some((i) =>
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
