import { intro, outro } from '@clack/prompts';
import { toKebabCase } from '@std/text';
import autocomplete from 'inquirer-autocomplete-standalone';
import { bgBrightBlue, bgBrightGreen, black } from './colors.ts';
import { CommandContainer } from './container.ts';
import { dispatchCommand } from './dispatchCommand.ts';

export class Command {
  public async execute(): Promise<void> {
    const commands = CommandContainer.toJson()
      .map((c) => ({
        value: c.name,
        description: c.name,
      }))
      .sort();

    const answer = await autocomplete({
      message: 'Select a command',
      source: async () => commands,
    });

    intro(
      bgBrightGreen(black(`   ${toKebabCase(answer).replace('-', ' ')}   `)),
    );

    await dispatchCommand(answer);

    outro(bgBrightBlue(black('   Thanks for using Eagle!   ')));
  }
}
