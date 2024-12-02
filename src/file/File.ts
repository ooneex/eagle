import { IFile } from './types.ts';

/**
 * File class for handling file system operations
 * Implements the IFile interface
 */
export class File implements IFile {
  /**
   * Creates a new File instance
   * @param path File system path
   */
  constructor(private readonly path: string) {}

  /**
   * Lists files/directories at the specified path
   * @param options Listing options
   * @param options.recursive Whether to list files recursively
   * @param options.match RegExp to match filenames
   * @param options.exclude RegExp to exclude filenames
   * @param options.directory Whether to list directories instead of files
   * @returns Array of matching file paths
   */
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

  /**
   * Checks if file exists
   * @returns Boolean indicating if file exists
   */
  public exists(): boolean {
    try {
      Deno.lstatSync(this.path);
      return true;
    } catch (_e) {
      return false;
    }
  }

  /**
   * Creates directory recursively
   * @param options Directory creation options
   */
  public async createDir(
    options: Deno.MkdirOptions = { recursive: true },
  ): Promise<void> {
    await Deno.mkdir(this.path.replace(/\/[^\/]+$/, ''), options);
  }

  /**
   * Creates directory recursively (sync)
   * @param options Directory creation options
   */
  public createDirSync(options: Deno.MkdirOptions = { recursive: true }): void {
    Deno.mkdirSync(this.path.replace(/\/[^\/]+$/, ''), options);
  }

  /**
   * Reads file contents as text
   * @param options File read options
   * @returns File contents as string
   */
  public async read(options?: Deno.ReadFileOptions): Promise<string> {
    return await Deno.readTextFile(this.path, options);
  }

  /**
   * Reads file contents as text (sync)
   * @returns File contents as string
   */
  public readSync(): string {
    return Deno.readTextFileSync(this.path);
  }

  /**
   * Reads and parses JSON file
   * @param options File read options
   * @returns Parsed JSON data
   */
  public async readJson<T = unknown>(
    options?: Deno.ReadFileOptions,
  ): Promise<T> {
    return JSON.parse(await this.read(options));
  }

  /**
   * Reads and parses JSON file (sync)
   * @returns Parsed JSON data
   */
  public readJsonSync<T = unknown>(): T {
    return JSON.parse(this.readSync());
  }

  /**
   * Writes string data to file
   * @param data String content to write
   * @param options File write options
   */
  public async write(
    data: string,
    options?: Deno.WriteFileOptions,
  ): Promise<void> {
    await this.createDir();
    await Deno.writeTextFile(this.path, data, options);
  }

  /**
   * Writes string data to file (sync)
   * @param data String content to write
   * @param options File write options
   */
  public writeSync(
    data: string,
    options?: Deno.WriteFileOptions,
  ): void {
    this.createDirSync();
    Deno.writeTextFileSync(this.path, data, options);
  }

  /**
   * Writes JSON data to file
   * @param data Data to stringify and write
   * @param options File write options
   */
  public async writeJson(
    data: unknown,
    options?: Deno.WriteFileOptions,
  ): Promise<void> {
    await this.createDir();
    await this.write(JSON.stringify(data), options);
  }

  /**
   * Writes JSON data to file (sync)
   * @param data Data to stringify and write
   * @param options File write options
   */
  public writeJsonSync(
    data: unknown,
    options?: Deno.WriteFileOptions,
  ): void {
    this.createDirSync();
    this.writeSync(JSON.stringify(data), options);
  }
}
