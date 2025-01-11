import { container } from '@/container/container.ts';
import { log } from '@clack/prompts';
import { CommandContainer } from './container.ts';
import { ConfirmPrompt } from './prompts/ConfirmPrompt.ts';
import { InputPrompt } from './prompts/InputPrompt.ts';
import { MultiSelectPrompt } from './prompts/MultiSelectPrompt.ts';
import { SelectPrompt } from './prompts/SelectPrompt.ts';
import { TaskPrompt } from './prompts/TaskPrompt.ts';
import type { ICommand } from './types.ts';

export const dispatchCommand = async (commandName: string): Promise<void> => {
  const command = CommandContainer.find((c) => c.name === commandName);
  if (!command) {
    return;
  }

  const instance = container.get<ICommand>(command.value);
  await instance.execute({
    log: {
      error: (message: string) => log.error(message),
      info: (message: string) => log.info(message),
      message: (message: string) => log.message(message),
      step: (message: string) => log.step(message),
      success: (message: string) => log.success(message),
      warning: (message: string) => log.warning(message),
    },
    prompt: {
      confirm: ConfirmPrompt,
      input: InputPrompt,
      select: SelectPrompt,
      multiSelect: MultiSelectPrompt,
      task: TaskPrompt,
    },
  });
};
