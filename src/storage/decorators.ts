import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { StorageDecoratorException } from './StorageDecoratorException.ts';

export const storage = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}) => {
  return (storage: any) => {
    const name = storage.prototype.constructor.name;
    ensureIsStorage(name, storage);

    container.add(name, storage, {
      scope: options?.scope ?? 'storage',
      singleton: options?.singleton ?? false,
      instance: false,
    });
  };
};

const ensureIsStorage = (name: string, storage: any) => {
  if (
    !name.endsWith('Storage') ||
    !storage.prototype.get ||
    !storage.prototype.put ||
    !storage.prototype.delete
  ) {
    throw new StorageDecoratorException(
      `Storage decorator can only be used on storage classes. ${name} must end with Storage keyword and implement IStorage interface.`,
    );
  }
};
