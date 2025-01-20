import { multiselect } from '@clack/prompts';
import type { ScalarType } from '../../types';

export const MultiSelectPrompt = async (
  message: string,
  options: { value: ScalarType; label: string; hint?: string }[],
  config?: { default?: ScalarType[]; max?: number; required?: boolean },
): Promise<ScalarType[]> => {
  return (await multiselect({
    message,
    options,
    initialValues: config?.default,
    maxItems: config?.max,
    required: config?.required,
  })) as ScalarType[];
};
