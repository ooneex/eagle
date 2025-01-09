import { ArrayCollection } from '@/collection/ArrayCollection.ts';

export const SeedContainer: ArrayCollection<{
  value: any;
  order: number;
}> = new ArrayCollection<{ value: any; order: number }>();
