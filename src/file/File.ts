import { IFile } from './types.ts';

export class File implements IFile {
  constructor(private readonly path: string) {}

  public list(options: {
    recursive?: boolean;
    match?: RegExp;
    exclude?: RegExp;
    directory?: boolean;
  } = {}): string[] {
    const files: string[] = [];
    const { recursive = false, match, exclude, directory = false } = options;
    const path = this.path;

    try {
      for (const entry of Deno.readDirSync(path)) {
        const fullPath = `${path}/${entry.name}`;

        if (entry.isDirectory && recursive) {
          const subFile = new File(fullPath);

          files.push(...subFile.list(options));
          continue;
        }

        if (entry.isFile && !directory) {
          if (match && !match.test(entry.name)) {
            continue;
          }

          if (exclude && exclude.test(entry.name)) {
            continue;
          }

          files.push(fullPath);
        }

        if (entry.isDirectory && directory) {
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

  public exists(): boolean {
    try {
      Deno.lstatSync(this.path);
      return true;
    } catch (_e) {
      return false;
    }
  }

  public async createDir(
    options: Deno.MkdirOptions = { recursive: true },
  ): Promise<void> {
    await Deno.mkdir(this.path.replace(/\/[^\/]+$/, ''), options);
  }

  public createDirSync(options: Deno.MkdirOptions = { recursive: true }): void {
    Deno.mkdirSync(this.path.replace(/\/[^\/]+$/, ''), options);
  }

  public async read(options?: Deno.ReadFileOptions): Promise<string> {
    return await Deno.readTextFile(this.path, options);
  }

  public readSync(): string {
    return Deno.readTextFileSync(this.path);
  }

  public async readJson<T = unknown>(
    options?: Deno.ReadFileOptions,
  ): Promise<T> {
    return JSON.parse(await this.read(options));
  }

  public readJsonSync<T = unknown>(): T {
    return JSON.parse(this.readSync());
  }

  public async write(
    data: string,
    options?: Deno.WriteFileOptions,
  ): Promise<void> {
    await this.createDir();
    await Deno.writeTextFile(this.path, data, options);
  }

  public writeSync(
    data: string,
    options?: Deno.WriteFileOptions,
  ): void {
    this.createDirSync();
    Deno.writeTextFileSync(this.path, data, options);
  }

  public async writeJson(
    data: unknown,
    options?: Deno.WriteFileOptions,
  ): Promise<void> {
    await this.createDir();
    await this.write(JSON.stringify(data), options);
  }

  public writeJsonSync(
    data: unknown,
    options?: Deno.WriteFileOptions,
  ): void {
    this.createDirSync();
    this.writeSync(JSON.stringify(data), options);
  }
}
