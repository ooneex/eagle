import type { ScalarType } from '@/types.ts';

export interface IConfig {
  toJson: () => Record<string, ScalarType | null>;
}
