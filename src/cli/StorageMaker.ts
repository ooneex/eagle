/**
 * Imports required for creating storage classes
 */
import { green } from 'jsr:@std/fmt@1.0.3/colors';
import { toKebabCase } from 'jsr:@std/text@1.0.8/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text@1.0.8/to-pascal-case';
import {
  cancel,
  isCancel,
  outro,
  select,
  text,
} from 'npm:@clack/prompts@0.8.2';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';

/**
 * Options that can be passed to StorageMaker
 */
type StorageMakerOptionsType = {
  /** Name of the module to create storage in */
  moduleName?: string;
  /** Name for the new storage class */
  name?: string;
};

/**
 * Creates new storage classes with CloudflareStorage implementation
 */
export class StorageMaker {
  /**
   * Creates a new storage class
   * @param options Optional configuration for storage creation
   */
  public static async execute(
    options?: StorageMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let storageName = options?.name ?? null;
    const srcDir = `${Deno.cwd()}/src`;

    // If no module name provided, show selection prompt
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

    // If no storage name provided, show text input prompt
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

    // Create the storage class file
    let file = new File(
      `${srcDir}/${moduleFolderName}/storages/${storageName}Storage.ts`,
    );
    await file.write(`import {
  CloudflareStorage,
  CloudflareStoragePutOptionsType,
  IStorage,
  storage,
} from '@ooneex/eagle/storage';
import {
  DeleteObjectOutput,
  GetObjectOutput,
  PutObjectOutput,
} from 'npm:@aws-sdk/client-s3@3.703.0';

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

    // Update the module file to import the new storage
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './storages/${storageName}Storage.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${storageName}Storage created successfully!`));
  }
}
