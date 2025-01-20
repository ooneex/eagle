import type { ScalarType } from '../types';

export interface IConfig {
  toJson: () => Record<string, ScalarType | null>;
}
