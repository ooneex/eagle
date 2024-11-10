import { Collection } from '@/collection/Collection.ts';
import { StoreControllerValueType } from '@/controller/types.ts';

export const ControllerStore = new Collection<
  string,
  StoreControllerValueType
>();
