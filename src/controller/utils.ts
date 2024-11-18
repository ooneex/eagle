import { trim } from '../helper/trim.ts';
import { ControllerContainer } from './container.ts';
import { ControllerMethodType, StoreControllerValueType } from './types.ts';

export const NOT_FOUND_CONTROLLER_KEY = 'NotFoundController';
export const SERVER_EXCEPTION_CONTROLLER_KEY = 'ServerExceptionController';

export const pathToRegexp = (path: string): RegExp => {
  const pattern = path
    .replace(/:([a-zA-Z]+)/g, '(?<$1>[^/]+)')
    .replace(/\//g, '\\/');

  return new RegExp(`^${pattern}$`);
};

export const findController = (
  req: Request,
): StoreControllerValueType | null => {
  const url = new URL(req.url);
  const path = `/${trim(url.pathname, '/')}`;
  const method = req.method.toUpperCase() as ControllerMethodType;
  const host = req.headers.get('host');
  const ip = req.headers.get('x-forwarded-for') ||
    req.headers.get('remote-addr');

  const controller = ControllerContainer.find(
    (_key: string, value: StoreControllerValueType) => {
      // Check if path matches any of the registered paths or regexps
      const pathMatch = value.paths?.includes(path) ||
        value.regexp?.some((re) => re.test(path));
      if (!pathMatch) return false;

      // Check if method matches any of the registered methods
      if (
        value.methods &&
        value.methods.length > 0 &&
        !value.methods.includes(method)
      ) {
        return false;
      }

      // Check if host matches any of the registered hosts
      if (value.hosts && value.hosts.length > 0 && host) {
        const hostMatch = value.hosts.some((h) => {
          if (h instanceof RegExp) {
            return h.test(host);
          }
          return h === host;
        });
        if (!hostMatch) return false;
      }

      // Check if IP matches any of the registered IPs
      if (value.ips && value.ips.length > 0 && ip) {
        const ipMatch = value.ips.some((i) => {
          if (i instanceof RegExp) {
            return i.test(ip);
          }
          return i === ip;
        });
        if (!ipMatch) return false;
      }

      return true;
    },
  );

  return controller?.value ||
    ControllerContainer.get(NOT_FOUND_CONTROLLER_KEY) || null;
};
