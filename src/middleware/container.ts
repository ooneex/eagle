import { Collection } from '@/collection/Collection.ts';
import type { MiddlewareEventType, MiddlewareValueType } from './types';

export const MiddlewareContainer = new Collection<
  MiddlewareEventType,
  MiddlewareValueType[]
>([
  ['request', []],
  ['response', []],
  ['exception', []],
  ['kernel:init', []],
  ['kernel:finish', []],
]);
