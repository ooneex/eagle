import { ArrayCollection } from '@/collection/ArrayCollection.ts';
import type { ControllerPathConfigType } from './types.ts';

export const ControllerContainer: ArrayCollection<ControllerPathConfigType> =
  new ArrayCollection<ControllerPathConfigType>();
