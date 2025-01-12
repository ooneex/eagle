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
      seeds: 'seeds',
      database: 'database',
      commands: 'commands',
      migrations: 'database/migrations',
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
      schema: 'schemas',
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
