import { select } from '@clack/prompts';
import type { ScalarType } from '../../types';

export const SelectPrompt = async (
  message: string,
  options: { value: ScalarType; label: string; hint?: string }[],
  config?: { default?: ScalarType; max?: number },
): Promise<ScalarType> => {
  return (await select({
    message,
    options,
    initialValue: config?.default,
    maxItems: config?.max,
  })) as ScalarType;
};
