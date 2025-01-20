import { isEmpty } from 'class-validator';
import { command } from '../../decorators';
import type { CommandParamType, ICommand } from '../../types';
import { createService } from './createService';

@command()
export class ServiceMakerCommand implements ICommand {
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
    const service = await prompt.input('Enter the service name', {
      placeholder: 'e.g. module/service',
      validator: (value) => {
        if (isEmpty(value)) {
          return 'Service name is required';
        }

        if (value.split('/').length !== 2) {
          return 'Service name must be in the format of module/service';
        }

        let [moduleFolder, serviceName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        const folderName = toKebabCase(serviceName);
        serviceName = toPascalCase(serviceName);
        const fileName = `${directory.src}/${moduleFolder}/${folderName}/${serviceName}Service.ts`;
        if (file.exists(fileName))
          return `${serviceName}Service already exists`;
      },
    });

    if (isCanceled(service)) {
      log.error(color.red('Service creation canceled'));
      return;
    }

    const [module, name] = service.split('/');

    const { serviceName, moduleName, moduleFolder } = await createService({
      name,
      moduleName: module,
      srcDir: directory.src,
      serviceDir: directory.service,
    });

    log.success(color.green(`${serviceName} created`));
    log.message(
      color.reset(
        color.dim(`${icon.success} ${moduleFolder}/${directory.service}/${serviceName}.ts was created
${icon.success} ${directory.service}/${serviceName}.ts was imported to ${moduleFolder}/${moduleName}.ts`),
      ),
    );
  }
}
