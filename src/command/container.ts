import { ArrayCollection } from '@/collection/ArrayCollection.ts';

export const CommandContainer = new ArrayCollection<{
  name: string;
  description?: string;
  value: any;
}>();
