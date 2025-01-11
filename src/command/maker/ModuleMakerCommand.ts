import { command } from '../decorators';
import type { CommandParamType, ICommand } from '../types';

@command()
export class ModuleMakerCommand implements ICommand {
  public async execute({ prompt, log }: CommandParamType): Promise<void> {
    const module = await prompt.input('Enter the module name', {
      placeholder: 'Without the "Module" suffix',
    });
    log.info(`Module name: ${module}`);
  }
}
