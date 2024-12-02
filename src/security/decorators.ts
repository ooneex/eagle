import { container } from '../container/Container.ts';
import { PermissionDecoratorException } from './PermissionDecoratorException.ts';

/**
 * Permission decorator factory function.
 * Creates a decorator that registers a permission class into the container.
 * The decorated class must end with 'Permission' in its name.
 * @returns A decorator function that takes a permission class
 */
export const permission = () => {
  return (permission: any) => {
    const name = permission.prototype.constructor.name;
    ensureIsPermission(name);

    container.add(name, permission, {
      scope: 'permission',
      singleton: true,
      instance: false,
    });
  };
};

/**
 * Validates that a permission class name ends with 'Permission'
 * @param name The class name to validate
 * @throws PermissionDecoratorException if name doesn't end with 'Permission'
 */
const ensureIsPermission = (name: string) => {
  if (!name?.endsWith('Permission')) {
    throw new PermissionDecoratorException(
      `Permission decorator can only be used on permission classes. ${name} must end with Permission keyword.`,
    );
  }
};
