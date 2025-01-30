import { toSnakeCase } from '../helper/toSnakeCase';

export const snakeCase = (str: string): string => {
  return str
    .replace(/^(\w+)\((\w+)\)$/g, (_m, p1, p2) => {
      return `${p1}(${toSnakeCase(p2)})`;
    })
    .replace(/^(\w+)\((\w+)\.(\w+)\)$/g, (_m, p1, p2, p3) => {
      return `${p1}(${p2}.${toSnakeCase(p3)})`;
    })
    .replace(/^(\w+)$/g, (_m, p1) => {
      return toSnakeCase(p1);
    })
    .replace(/^(\w+)\.(\w+)$/g, (_m, p1, p2) => {
      return `${p1}.${toSnakeCase(p2)}`;
    });
};
