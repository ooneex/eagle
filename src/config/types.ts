import type { ScalarType } from '../types';

export interface IConfig {
  toJson: <T = Record<string, ScalarType | null>>() => T;
}
