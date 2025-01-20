import { toKebabCase } from '@std/text/to-kebab-case';
import { toPascalCase } from '@std/text/to-pascal-case';
import { createModule } from '../module/createModule';

export const createMiddleware = async (config: {
  name: string;
  moduleName: string;
  srcDir: string;
  middlewareDir: string;
}): Promise<{
  middlewareFolder: string;
  middlewareName: string;
  moduleName: string;
  moduleFolder: string;
}> => {
  const { moduleFolder, moduleName } = await createModule({
    name: config.moduleName,
    srcDir: config.srcDir,
  });

  const middlewareFolder = toKebabCase(config.name);
  const middlewareName = `${toPascalCase(config.moduleName)}${toPascalCase(middlewareFolder)}Middleware`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.middlewareDir}`;
  const importContent = `export { ${middlewareName} } from './${config.middlewareDir}/${middlewareName}.ts';`;
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

  const fileName = `${config.srcDir}/${moduleFolder}/${config.middlewareDir}/${middlewareName}.ts`;
  const content = `import {
  type IMiddleware,
  type MiddlewareContextType,
  middleware,
} from '@ooneex/eagle';

@middleware({ on: 'request' })
export class ${middlewareName} implements IMiddleware {
  public next(
    context: MiddlewareContextType,
  ): MiddlewareContextType | Promise<MiddlewareContextType> {
    // code goes here
    return context;
  }
}
`;

  await Bun.file(fileName).write(content);

  return { middlewareFolder, middlewareName, moduleName, moduleFolder };
};
