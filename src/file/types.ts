export interface IFile {
  list: (options?: {
    recursive?: boolean;
    match?: RegExp;
    exclude?: RegExp;
  }) => string[];
  exists: () => Promise<boolean>;
  read: (options?: Deno.ReadFileOptions) => Promise<string>;
  readJson: <T = unknown>(options?: Deno.ReadFileOptions) => Promise<T>;
  write: (data: string, options?: Deno.WriteFileOptions) => Promise<void>;
  writeJson: (data: unknown, options?: Deno.WriteFileOptions) => Promise<void>;
}
