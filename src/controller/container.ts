import { Collection } from '../collection/Collection.ts';
import { StoreControllerValueType } from '../controller/types.ts';

export const ControllerContainer = new Collection<
  string,
  StoreControllerValueType
>();
