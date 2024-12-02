import { ArrayCollection } from '../collection/ArrayCollection.ts';

/**
 * Global container for holding seed sources that should be run at application start-up.
 * Contains an array collection of seed source strings that will be executed in order.
 */
export const SeedContainer: ArrayCollection<string> = new ArrayCollection<
  string
>();
