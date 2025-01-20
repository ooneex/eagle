import { ArrayCollection } from '../collection/ArrayCollection';

export const SeedContainer: ArrayCollection<{
  value: any;
  order: number;
}> = new ArrayCollection<{ value: any; order: number }>();
