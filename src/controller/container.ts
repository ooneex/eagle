import { Collection } from '../collection/Collection.ts';
import { StoreControllerValueType } from '../controller/types.ts';

/**
 * Container that stores store controller instances.
 * Maps controller names (string) to their corresponding controller instances.
 */
export const ControllerContainer: Collection<
  string,
  StoreControllerValueType
> = new Collection<
  string,
  StoreControllerValueType
>();
