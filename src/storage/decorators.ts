import { container } from '@/container/container.ts';
import type { DecoratorScopeType } from '@/types.ts';
import { StorageDecoratorException } from './StorageDecoratorException.ts';

export const storage = (options?: {
  scope?: DecoratorScopeType;
}): ClassDecorator => {
  return (storage: any) => {
    const name = storage.prototype.constructor.name;
    ensureIsStorage(name, storage);

    if (options?.scope === 'transient') {
      container.bind(storage).toSelf().inTransientScope();
    } else {
      container.bind(storage).toSelf().inSingletonScope();
    }
  };
};

const ensureIsStorage = (name: string, storage: any): void => {
  if (
    !name.endsWith('Storage') ||
    !storage.prototype.getOptions ||
    !storage.prototype.exists ||
    !storage.prototype.delete ||
    !storage.prototype.putFile ||
    !storage.prototype.put ||
    !storage.prototype.getAsJson ||
    !storage.prototype.getAsArrayBuffer ||
    !storage.prototype.getAsStream
  ) {
    throw new StorageDecoratorException(
      `Storage decorator can only be used on storage classes. ${name} must end with Storage keyword and implement IStorage interface.`,
    );
  }
};
