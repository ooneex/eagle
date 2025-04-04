import { isEmpty } from 'class-validator';
import { command } from '../../decorators';
import type { CommandParamType, ICommand } from '../../types';
import { createController } from './createController';

@command()
export class ControllerMakerCommand implements ICommand {
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
    const controller = await prompt.input('Enter the controller name', {
      placeholder: 'e.g. module/controller',
      validator: (value) => {
        if (isEmpty(value)) {
          return 'Controller name is required';
        }

        if (value.split('/').length !== 2) {
          return 'Controller name must be in the format of module/controller';
        }

        let [moduleFolder, configName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        const folderName = toKebabCase(configName);
        configName = toPascalCase(configName);
        const fileName = `${directory.src}/${moduleFolder}/${folderName}/${configName}Controller.ts`;
        if (file.exists(fileName))
          return `${configName}Controller already exists`;
      },
    });

    if (isCanceled(controller)) {
      log.error(color.red('Controller creation canceled'));
      return;
    }

    const [module, name] = controller.split('/');

    const defaultPath = `/${toKebabCase(name)}`;
    const path = await prompt.input('Enter the path', {
      placeholder: defaultPath,
      default: defaultPath,
      validator: (value) => {
        if (!value.startsWith('/')) return 'Path must start with /';
      },
    });

    if (isCanceled(path)) {
      log.error(color.red('Path selection canceled'));
      return;
    }

    const method = (await prompt.select(
      'Select the method',
      [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'PATCH', label: 'PATCH' },
        { value: 'OPTIONS', label: 'OPTIONS' },
        { value: 'HEAD', label: 'HEAD' },
      ],
      {
        default: 'GET',
      },
    )) as string;

    if (isCanceled(method)) {
      log.error(color.red('Method selection canceled'));
      return;
    }

    const role = (await prompt.select(
      'Select the role',
      [
        { value: 'guest', label: 'Guest' },
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
        { value: 'master', label: 'Master' },
      ],
      {
        default: 'user',
      },
    )) as string;

    const { controllerName, moduleName, moduleFolder } = await createController(
      {
        name,
        method,
        path,
        role,
        moduleName: module,
        srcDir: directory.src,
        controllerDir: directory.controller,
      },
    );

    log.success(color.green(`${controllerName} created`));
    log.message(
      color.reset(
        color.dim(
          `${icon.success} ${moduleFolder}/${directory.controller}/${controllerName}.ts was created
${icon.success} ${directory.controller}/${controllerName}.ts was imported to ${moduleFolder}/${moduleName}.ts`,
        ),
      ),
    );
  }
}
