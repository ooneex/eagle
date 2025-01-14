import { intro, outro } from '@clack/prompts';
import { bgBrightBlue, bgBrightGreen, black } from './colors.ts';
import { CommandContainer } from './container.ts';
import { dispatchCommand } from './dispatchCommand.ts';

const { AutoComplete } = require('enquirer');

export class Command {
  public async execute(): Promise<void> {
    const commands = CommandContainer.toJson()
      .map((c) => c.name)
      .sort();

    console.info(commands);

    const prompt = new AutoComplete({
      name: 'command',
      message: 'Select a command',
      // limit: 10,
      // initial: 2,
      choices: commands,
    });

    const command = await prompt.run();

    console.info(command);

    intro(bgBrightGreen(black(`   ${command}   `)));

    await dispatchCommand(command as string);

    outro(bgBrightBlue(black('   Thanks for using Eagle!   ')));
  }
}
