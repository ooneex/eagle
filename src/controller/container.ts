import { Collection } from '@/collection/Collection.ts';
import type { ControllerRouteConfigType } from './types.ts';

export const ControllerContainer: Collection<
  string,
  ControllerRouteConfigType
> = new Collection<string, ControllerRouteConfigType>();
