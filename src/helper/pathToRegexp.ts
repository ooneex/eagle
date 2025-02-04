export const pathToRegexp = (path: string): RegExp => {
  const pattern = path
    .replace(/:([a-zA-Z]+)/g, '(?<$1>[^/]+)')
    .replace(/\//g, '\\/');

  return new RegExp(`^${pattern}$`);
};
