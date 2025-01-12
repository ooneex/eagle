import fs from 'node:fs';
import { container } from '@/container/container.ts';
import { toKebabCase } from '@/helper/toKebabCase.ts';
import { toPascalCase } from '@/helper/toPascalCase.ts';
import { isCancel, log } from '@clack/prompts';
import * as icon from 'log-symbols';
import * as colors from './colors.ts';
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

  const cwd = `${process.cwd()}/sapphire`;
  const src = `${cwd}/src`;

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
    color: colors,
    icon: icon.default,
    directory: {
      cwd,
      src,
      seeds: `${cwd}/seeds`,
      database: `${cwd}/database`,
      commands: `${cwd}/commands`,
      migrations: `${cwd}/database/migrations`,
      getConfig: (moduleName: string) => `${src}/${moduleName}/config`,
      getController: (moduleName: string) => `${src}/${moduleName}/controllers`,
      getRepository: (moduleName: string) =>
        `${src}/${moduleName}/repositories`,
      getService: (moduleName: string) => `${src}/${moduleName}/services`,
      getMailer: (moduleName: string) => `${src}/${moduleName}/mailers`,
      getMiddleware: (moduleName: string) => `${src}/${moduleName}/middlewares`,
      getPermission: (moduleName: string) => `${src}/${moduleName}/permissions`,
      getStorage: (moduleName: string) => `${src}/${moduleName}/storages`,
      getValidation: (moduleName: string) => `${src}/${moduleName}/validations`,
      getEntity: (moduleName: string) => `${src}/${moduleName}/entities`,
      getSchema: (moduleName: string) => `${src}/${moduleName}/schemas`,
    },
    isCanceled: isCancel,
    toPascalCase,
    toKebabCase,
    file: {
      exists: fs.existsSync,
      read: fs.readFileSync,
      write: fs.writeFileSync,
      delete: fs.unlinkSync,
      readdir: fs.readdirSync,
      mkdir: fs.mkdirSync,
      rmdir: fs.rmdirSync,
    },
  });
};
