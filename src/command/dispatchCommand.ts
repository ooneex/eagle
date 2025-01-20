import fs from 'node:fs';
import { isCancel, log } from '@clack/prompts';
import * as icon from 'log-symbols';
import { container } from '../container/container';
import { toKebabCase, toPascalCase } from '../helper';
import * as colors from './colors';
import { CommandContainer } from './container';
import { ConfirmPrompt } from './prompts/ConfirmPrompt';
import { InputPrompt } from './prompts/InputPrompt';
import { MultiSelectPrompt } from './prompts/MultiSelectPrompt';
import { SelectPrompt } from './prompts/SelectPrompt';
import { TaskPrompt } from './prompts/TaskPrompt';
import type { ICommand } from './types';

export const dispatchCommand = async (commandName: string): Promise<void> => {
  const command = CommandContainer.find((c) => c.name === commandName);
  if (!command) {
    return;
  }

  const cwd = `${process.cwd()}`;
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
      seeds: 'seeds',
      database: 'databases',
      commands: 'commands',
      config: 'config',
      controller: 'controllers',
      repository: 'repositories',
      service: 'services',
      mailer: 'emails',
      middleware: 'middlewares',
      permission: 'permissions',
      storage: 'storage',
      validation: 'validations',
      entity: 'entities',
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
