import { ArrayCollection } from '@/collection/ArrayCollection.ts';

export const CommandContainer: ArrayCollection<{
  name: string;
  description?: string;
  value: any;
}> = new ArrayCollection<{
  name: string;
  description?: string;
  value: any;
}>();
