import { container } from '../container/Container.ts';
import { PermissionDecoratorException } from './PermissionDecoratorException.ts';

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

const ensureIsPermission = (name: string) => {
  if (!name?.endsWith('Permission')) {
    throw new PermissionDecoratorException(
      `Permission decorator can only be used on permission classes. ${name} must end with Permission keyword.`,
    );
  }
};
