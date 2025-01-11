import { intro, outro } from '@clack/prompts';
import { bgBrightBlue, bgBrightGreen, black } from './colors.ts';
import { CommandContainer } from './container.ts';
import { dispatchCommand } from './dispatchCommand.ts';
import { SelectPrompt } from './prompts/SelectPrompt.ts';

export class Command {
  public async execute(): Promise<void> {
    console.info(process.cwd());

    console.info('\n');

    intro(bgBrightGreen(black('   Eagle command runner   ')));

    const commands = CommandContainer.toJson()
      .map((c) => ({ value: c.name, label: c.name.replace(/Command$/, '') }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const command = await SelectPrompt('Select a command', commands);

    await dispatchCommand(command as string);

    outro(bgBrightBlue(black('   Thanks for using Eagle!   ')));
  }
}
