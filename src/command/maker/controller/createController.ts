import { toKebabCase, toPascalCase } from '../../../helper';
import { createModule } from '../module/createModule';

export const createController = async (config: {
  name: string;
  method: string;
  path: string;
  role: string;
  moduleName: string;
  srcDir: string;
  controllerDir: string;
}): Promise<{
  controllerFolder: string;
  controllerName: string;
  moduleName: string;
  moduleFolder: string;
}> => {
  const { moduleFolder, moduleName } = await createModule({
    name: config.moduleName,
    srcDir: config.srcDir,
  });

  const controllerFolder = toKebabCase(config.name);
  const controllerName = `${toPascalCase(config.moduleName)}${toPascalCase(controllerFolder)}Controller`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.controllerDir}`;
  const importContent = `export { ${controllerName} } from './${config.controllerDir}/${controllerName}.ts';`;
  const configModuleFile = Bun.file(
    `${config.srcDir}/${moduleFolder}/${moduleName}.ts`,
  );

  if (await configModuleFile.exists()) {
    const content = await configModuleFile.text();
    if (!content.includes(importContent)) {
      await configModuleFile.write(`${content}${importContent}\n`);
    }
  } else {
    await configModuleFile.write(`${importContent}\n`);
  }

  const fileName = `${config.srcDir}/${moduleFolder}/${config.controllerDir}/${controllerName}.ts`;
  const content = `import { type HttpResponse, type ActionParamType, type IController, Route } from '@ooneex/eagle';

@Route.${config.method.toLowerCase()}('${config.path}')
@Route.role.${config.role}()
export class ${controllerName} implements IController {
  public action({ response, request }: ActionParamType): HttpResponse {
    // code goes here
    return response.json({ params: request.params.toJson() });
  }
}
`;

  await Bun.file(fileName).write(content);

  return {
    controllerFolder: controllerFolder,
    controllerName: controllerName,
    moduleName,
    moduleFolder,
  };
};
