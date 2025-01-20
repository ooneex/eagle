import { Collection } from '../collection/Collection';
import type { ControllerRouteConfigType } from './types';

export const ControllerContainer: Collection<
  string,
  ControllerRouteConfigType
> = new Collection<string, ControllerRouteConfigType>();
