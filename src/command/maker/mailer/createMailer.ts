import { toKebabCase, toPascalCase } from '../../../helper';
import { createModule } from '../module/createModule';

export const createMailer = async (config: {
  name: string;
  moduleName: string;
  srcDir: string;
  mailerDir: string;
}): Promise<{
  mailerFolder: string;
  mailerName: string;
  moduleName: string;
  moduleFolder: string;
}> => {
  const { moduleFolder, moduleName } = await createModule({
    name: config.moduleName,
    srcDir: config.srcDir,
  });

  const mailerFolder = toKebabCase(config.name);
  const mailerName = `${toPascalCase(config.moduleName)}${toPascalCase(mailerFolder)}Mailer`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.mailerDir}`;
  const importContent = `import './${config.mailerDir}/${mailerName}';`;
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

  const fileName = `${config.srcDir}/${moduleFolder}/${config.mailerDir}/${mailerName}.ts`;
  const content = `import { type IMailer, mailer } from '@ooneex/eagle';

@mailer()
export class ${mailerName} implements IMailer {
  public async send<T = boolean>(): Promise<T> {
    // code goes here
    return true as T;
  }
}
`;

  await Bun.file(fileName).write(content);

  return { mailerFolder, mailerName, moduleName, moduleFolder };
};
