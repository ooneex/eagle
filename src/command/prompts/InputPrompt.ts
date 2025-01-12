import { text } from '@clack/prompts';

export const InputPrompt = async (
  message: string,
  config?: {
    name?: string;
    placeholder?: string;
    default?: string;
    validator?: (value: string) => string | Error | undefined;
  },
): Promise<string> => {
  return (await text({
    message,
    placeholder: config?.placeholder,
    initialValue: config?.default,
    validate: config?.validator,
  })) as string;
};
