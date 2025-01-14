import { intro, outro } from '@clack/prompts';
import { toKebabCase, toPascalCase } from '@std/text';
import autocomplete, { Separator } from 'inquirer-autocomplete-standalone';
import { bgBrightBlue, bgBrightGreen, black } from './colors.ts';
import { CommandContainer } from './container.ts';
import { dispatchCommand } from './dispatchCommand.ts';

export class Command {
  public async execute(): Promise<void> {
    const commands = CommandContainer.toJson()
      .map((c: any) => ({
        value: c.name,
        name: toKebabCase(c.name)
          .replaceAll('-', ' ')
          .replace(/^\w/, (c) => c.toUpperCase()),
      }))
      .sort();

    console.info('\n');

    const answer = await autocomplete({
      message: 'Select a command',
      source: async (input) => [
        new Separator(''),
        ...commands.filter((c) =>
          c.value.toLowerCase().includes(input?.toLowerCase() ?? ''),
        ),
      ],
      pageSize: 10,
    });

    console.info('\n');

    intro(
      bgBrightGreen(
        black(`   ${toPascalCase(answer).replaceAll('-', ' ')}   `),
      ),
    );

    await dispatchCommand(answer);

    outro(bgBrightBlue(black('   Thanks for using Eagle!   ')));
  }
}
