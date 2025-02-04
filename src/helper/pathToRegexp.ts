import { pathToRegexp as pathToReg } from 'path-to-regexp';

export const pathToRegexp = (path: string): RegExp => {
  return pathToReg(path).regexp;
};
