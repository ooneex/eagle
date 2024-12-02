import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { StorageDecoratorException } from './StorageDecoratorException.ts';

/**
 * Decorator for storage classes that ensures proper naming and interface implementation.
 * @param options Configuration options for the storage decorator
 * @param options.scope The container scope type for the storage
 * @param options.singleton Whether the storage should be treated as a singleton
 * @returns Class decorator function
 */
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

/**
 * Validates that the decorated class is a proper storage class.
 * Checks that the class name ends with 'Storage' and implements the IStorage interface.
 * @param name The name of the storage class
 * @param storage The storage class to validate
 * @throws {StorageDecoratorException} If validation fails
 */
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
