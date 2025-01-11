import type { IValidator } from '@/validation/types.ts';
import { text } from '@clack/prompts';

export const InputPrompt = async (
  message: string,
  config?: {
    name?: string;
    placeholder?: string;
    default?: string;
    validator?: IValidator;
  },
): Promise<string> => {
  const name = config?.name ?? 'value';

  return (await text({
    message,
    placeholder: config?.placeholder,
    initialValue: config?.default,
    validate: (value) => {
      if (!config?.validator) {
        return;
      }

      const result = config.validator.validateSync({ [name]: value });

      if (result.success) {
        return;
      }

      return result.details[0]?.constraints?.contains;
    },
  })) as string;
};
