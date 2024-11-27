export interface IFile {
  list: (options?: {
    recursive?: boolean;
    match?: RegExp;
    exclude?: RegExp;
  }) => string[];
  exists: () => boolean;
  createDir: (options?: Deno.MkdirOptions) => Promise<void>;
  createDirSync: (options?: Deno.MkdirOptions) => void;
  read: (options?: Deno.ReadFileOptions) => Promise<string>;
  readSync: () => string;
  readJson: <T = unknown>(options?: Deno.ReadFileOptions) => Promise<T>;
  readJsonSync: <T = unknown>() => T;
  write: (data: string, options?: Deno.WriteFileOptions) => Promise<void>;
  writeSync: (data: string, options?: Deno.WriteFileOptions) => void;
  writeJson: (data: unknown, options?: Deno.WriteFileOptions) => Promise<void>;
  writeJsonSync: (data: unknown, options?: Deno.WriteFileOptions) => void;
}
