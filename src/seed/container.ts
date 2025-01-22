import { ArrayCollection } from '../collection/ArrayCollection';

export const SeedContainer: ArrayCollection<{
  value: any;
  order: number;
  active: boolean;
}> = new ArrayCollection<{ value: any; order: number; active: boolean }>();
