import { command } from '../decorators';
import type { CommandParamType, ICommand } from '../types';

@command()
export class MailerMakerCommand implements ICommand {
  public async execute({ prompt, log }: CommandParamType): Promise<void> {
    const config = await prompt.input('Enter the config name');
    log.info(`Config name: ${config}`);
  }
}
