import { IFile } from './types.ts';

export class File implements IFile {
  constructor(private readonly path: string) {}

  public list(options: {
    recursive?: boolean;
    match?: RegExp;
    exclude?: RegExp;
  } = {}): string[] {
    const files: string[] = [];
    const { recursive = false, match, exclude } = options;
    const path = this.path;

    try {
      for (const entry of Deno.readDirSync(path)) {
        const fullPath = `${path}/${entry.name}`;

        if (entry.isDirectory && recursive) {
          const subFile = new File(fullPath);

          files.push(...subFile.list(options));
          continue;
        }

        if (entry.isFile) {
          if (match && !match.test(entry.name)) {
            continue;
          }

          if (exclude && exclude.test(entry.name)) {
            continue;
          }

          files.push(fullPath);
        }
      }
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }

    return files;
  }

  public async exists(): Promise<boolean> {
    try {
      await Deno.lstat(this.path);
      return true;
    } catch (_e) {
      return false;
    }
  }

  public async read(options?: Deno.ReadFileOptions): Promise<string> {
    return await Deno.readTextFile(this.path, options);
  }

  public async readJson<T = unknown>(
    options?: Deno.ReadFileOptions,
  ): Promise<T> {
    return JSON.parse(await this.read(options));
  }

  public async write(
    data: string,
    options?: Deno.WriteFileOptions,
  ): Promise<void> {
    await Deno.writeTextFile(this.path, data, options);
  }

  public async writeJson(
    data: unknown,
    options?: Deno.WriteFileOptions,
  ): Promise<void> {
    await this.write(JSON.stringify(data), options);
  }
}
