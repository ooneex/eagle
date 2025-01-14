import { container } from '@/container/container.ts';
import type { DecoratorScopeType } from '@/types.ts';
import { injectable } from 'inversify';
import { CommandDecoratorException } from './CommandDecoratorException.ts';
import { CommandContainer } from './container.ts';

export const command = (
  description?: string,
  scope?: DecoratorScopeType,
): ClassDecorator => {
  return (command: any) => {
    const commandName = command.prototype.constructor.name;
    ensureIsCommand(commandName, command);

    injectable()(command);

    if (scope === 'transient') {
      container.bind(command).toSelf().inTransientScope();
    } else {
      container.bind(command).toSelf().inSingletonScope();
    }

    CommandContainer.add({
      name: commandName,
      description,
      value: command,
    });
  };
};

const ensureIsCommand = (name: string, command: any): void => {
  if (!name.endsWith('Command') || !command.prototype.execute) {
    throw new CommandDecoratorException(
      `Command decorator can only be used on command classes. ${name} must end with Command keyword and implement ICommand interface.`,
    );
  }
};
