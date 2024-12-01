import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { cancel, isCancel, outro, select, text } from 'npm:@clack/prompts';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';

type StorageMakerOptionsType = {
  moduleName?: string;
  name?: string;
};

export class StorageMaker {
  public static async execute(
    options?: StorageMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let storageName = options?.name ?? null;
    const srcDir = `${Deno.cwd()}/src`;

    if (!moduleName) {
      const modules = new File(srcDir).list({ directory: true });
      const options: { value: string; label: string }[] = [];
      for (const module of modules) {
        const m = module.replace(`${srcDir}/`, '');
        options.push({ value: m, label: m });
      }

      moduleName = (await select({
        message: 'Module',
        options,
      })) as string;
    }

    if (isCancel(moduleName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    const moduleFolderName = toKebabCase(moduleName);
    moduleName = toPascalCase(moduleName);

    if (!storageName) {
      storageName = (await text({
        message: 'Storage name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const storageName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/storages/${storageName}Storage.ts`,
          );

          if (file.exists()) {
            return `${storageName}Storage already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(storageName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    storageName = toPascalCase(storageName);

    let file = new File(
      `${srcDir}/${moduleFolderName}/storages/${storageName}Storage.ts`,
    );
    await file.write(`import {
  CloudflareStorage,
  CloudflareStoragePutOptionsType,
  IStorage,
  storage,
} from 'eagle/storage';
import {
  DeleteObjectOutput,
  GetObjectOutput,
  PutObjectOutput,
} from 'npm:@aws-sdk/client-s3';

@storage()
export class ${storageName}Storage implements IStorage {
  constructor(private readonly cloudflareStorage: CloudflareStorage) {}

  public async get<T = GetObjectOutput>(
    key: string,
    bucket: string,
  ): Promise<T> {
    return await this.cloudflareStorage.get<T>(key, bucket);
  }

  public async put<T = PutObjectOutput>(
    key: string,
    content: string,
    options?: CloudflareStoragePutOptionsType,
  ): Promise<T> {
    return await this.cloudflareStorage.put<T>(key, content, options);
  }

  public async delete<T = DeleteObjectOutput>(
    key: string,
    bucket: string,
  ): Promise<T> {
    return await this.cloudflareStorage.delete<T>(key, bucket);
  }
}
`);
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './storages/${storageName}Storage.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${storageName}Storage created successfully!`));
  }
}
