import type * as icon from 'log-symbols';
import type * as colors from './colors.ts';
import type { ConfirmPrompt } from './prompts/ConfirmPrompt';
import type { InputPrompt } from './prompts/InputPrompt';
import type { MultiSelectPrompt } from './prompts/MultiSelectPrompt';
import type { SelectPrompt } from './prompts/SelectPrompt';
import type { TaskPrompt } from './prompts/TaskPrompt';

export type CommandParamType = {
  log: {
    error: (message: string) => void;
    info: (message: string) => void;
    message: (message: string) => void;
    step: (message: string) => void;
    success: (message: string) => void;
    warning: (message: string) => void;
  };
  prompt: {
    confirm: typeof ConfirmPrompt;
    input: typeof InputPrompt;
    select: typeof SelectPrompt;
    multiSelect: typeof MultiSelectPrompt;
    task: typeof TaskPrompt;
  };
  color: typeof colors;
  icon: typeof icon;
};

export interface ICommand {
  execute(params: CommandParamType): Promise<void>;
}
