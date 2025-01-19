import { Collection } from '@/collection/Collection.ts';
import type { MiddlewareEventType, MiddlewareValueType } from './types';

export const MiddlewareContainer: Collection<
  MiddlewareEventType,
  MiddlewareValueType[]
> = new Collection<MiddlewareEventType, MiddlewareValueType[]>([
  ['request', []],
  ['response', []],
]);
