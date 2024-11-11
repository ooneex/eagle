export const pathToRegexp = (path: string): RegExp => {
  // Replace path parameters with regexp capture groups
  const pattern = path
    .replace(/:([a-zA-Z]+)/g, '(?<$1>[^/]+)') // Convert :param to named capture group
    .replace(/\//g, '\\/'); // Escape forward slashes

  // Create regexp with start/end anchors
  return new RegExp(`^${pattern}$`);
};
