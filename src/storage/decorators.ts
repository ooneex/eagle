import { container } from '../container/Container.ts';
import { StorageDecoratorException } from './StorageDecoratorException.ts';

export const storage = () => {
  return (storage: any) => {
    const name = storage.prototype.constructor.name;
    ensureIsStorage(name, storage);

    container.add(name, storage, {
      scope: 'storage',
      singleton: false,
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
