import { toKebabCase } from '@/helper/toKebabCase.ts';
import { toPascalCase } from '@/helper/toPascalCase.ts';
import { createModule } from '../module/createModule.ts';

export const createValidator = async (config: {
  name: string;
  moduleName: string;
  srcDir: string;
  validationDir: string;
}): Promise<{
  validatorFolder: string;
  validatorName: string;
  moduleName: string;
  moduleFolder: string;
}> => {
  const { moduleFolder, moduleName } = await createModule({
    name: config.moduleName,
    srcDir: config.srcDir,
  });

  const validatorFolder = toKebabCase(config.name);
  const validatorName = `${toPascalCase(config.moduleName)}${toPascalCase(validatorFolder)}Validator`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.validationDir}`;
  const importContent = `import './${config.validationDir}/${validatorName}.ts';`;
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

  const fileName = `${config.srcDir}/${moduleFolder}/${config.validationDir}/${validatorName}.ts`;
  const content = `import { AbstractValidator, cv, validator } from '@/validation';

@validator('payload')
export class ${validatorName} extends AbstractValidator {
  @cv.IsString()
  public name: string;

  @cv.IsNumber()
  public age: number;
}
`;

  await Bun.file(fileName).write(content);

  return { validatorFolder, validatorName, moduleName, moduleFolder };
};
