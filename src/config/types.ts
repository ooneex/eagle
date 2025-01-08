import type { ScalarType } from '@/types.ts';

/**
 * Configuration interface
 */
export interface IConfig {
  /**
   * Converts configuration to JSON format
   * @returns Configuration as JSON object
   */
  toJson: () => Record<string, ScalarType | null>;
}
