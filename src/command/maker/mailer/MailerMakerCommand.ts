import { isEmpty } from 'class-validator';
import { command } from '../../decorators';
import type { CommandParamType, ICommand } from '../../types';
import { createMailer } from './createMailer';

@command()
export class MailerMakerCommand implements ICommand {
  public async execute({
    prompt,
    log,
    isCanceled,
    color,
    toKebabCase,
    toPascalCase,
    directory,
    file,
    icon,
  }: CommandParamType): Promise<void> {
    const mailer = await prompt.input('Enter the mailer name', {
      placeholder: 'e.g. module/mailer',
      validator: (value) => {
        if (isEmpty(value)) {
          return 'Mailer name is required';
        }

        if (value.split('/').length !== 2) {
          return 'Mailer name must be in the format of module/mailer';
        }

        let [moduleFolder, mailerName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        const folderName = toKebabCase(mailerName);
        mailerName = toPascalCase(mailerName);
        const fileName = `${directory.src}/${moduleFolder}/${folderName}/${mailerName}Mailer.ts`;
        if (file.exists(fileName)) return `${mailerName}Mailer already exists`;
      },
    });

    if (isCanceled(mailer)) {
      log.error(color.red('Mailer creation canceled'));
      return;
    }

    const [module, name] = mailer.split('/');

    const { mailerName, moduleName, moduleFolder } = await createMailer({
      name,
      moduleName: module,
      srcDir: directory.src,
      mailerDir: directory.mailer,
    });

    log.success(color.green(`${mailerName} created`));
    log.message(
      color.reset(
        color.dim(
          `${icon.success} ${moduleFolder}/${directory.mailer}/${mailerName}.ts was created
${icon.success} ${directory.mailer}/${mailerName}.ts was imported to ${moduleFolder}/${moduleName}.ts`,
        ),
      ),
    );
  }
}
