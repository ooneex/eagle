import { confirm } from '@clack/prompts';

export const ConfirmPrompt = async (
  message: string,
  defaultValue?: boolean,
): Promise<boolean> => {
  return (await confirm({
    message,
    initialValue: defaultValue,
  })) as boolean;
};
