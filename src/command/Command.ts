import { intro, outro } from '@clack/prompts';
import { toKebabCase } from '@std/text';
import inquirer from 'inquirer';
import { bgBrightBlue, bgBrightGreen, black } from './colors.ts';
import { CommandContainer } from './container.ts';
import { dispatchCommand } from './dispatchCommand.ts';

inquirer.registerPrompt('search-list', require('inquirer-search-list'));

export class Command {
  public async execute(): Promise<void> {
    const commands = CommandContainer.toJson()
      .map((c) => c.name)
      .sort();

    inquirer
      // @ts-ignore
      .prompt([
        {
          type: 'search-list',
          message: 'Select a command',
          name: 'command',
          choices: commands,
        },
      ])
      .then(async (result) => {
        intro(
          bgBrightGreen(
            black(`   ${toKebabCase(result.command).replace('-', ' ')}   `),
          ),
        );

        await dispatchCommand(result.command as string);

        outro(bgBrightBlue(black('   Thanks for using Eagle!   ')));
      });
  }
}
