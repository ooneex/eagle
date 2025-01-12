import type fs from 'node:fs';
import type { toKebabCase } from '@/helper/toKebabCase.ts';
import type { toPascalCase } from '@/helper/toPascalCase.ts';
import type { isCancel } from '@clack/prompts';
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
  icon: typeof icon.default;
  directory: {
    cwd: string;
    src: string;
    seeds: string;
    database: string;
    commands: string;
    migrations: string;
    getConfig: (moduleName: string) => string;
    getController: (moduleName: string) => string;
    getRepository: (moduleName: string) => string;
    getService: (moduleName: string) => string;
    getMailer: (moduleName: string) => string;
    getMiddleware: (moduleName: string) => string;
    getPermission: (moduleName: string) => string;
    getStorage: (moduleName: string) => string;
    getValidation: (moduleName: string) => string;
    getEntity: (moduleName: string) => string;
    getSchema: (moduleName: string) => string;
  };
  isCanceled: typeof isCancel;
  toPascalCase: typeof toPascalCase;
  toKebabCase: typeof toKebabCase;
  file: {
    exists: typeof fs.existsSync;
    read: typeof fs.readFileSync;
    write: typeof fs.writeFileSync;
    delete: typeof fs.unlinkSync;
    readdir: typeof fs.readdirSync;
    mkdir: typeof fs.mkdirSync;
    rmdir: typeof fs.rmdirSync;
  };
};

export interface ICommand {
  execute(params: CommandParamType): Promise<void>;
}
