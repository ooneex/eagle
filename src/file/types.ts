/**
 * Interface for file operations
 */
export interface IFile {
  /**
   * Lists files matching given options
   * @param options Configuration for listing files
   * @param options.recursive Whether to list files recursively in subdirectories
   * @param options.match RegExp pattern to match filenames
   * @param options.exclude RegExp pattern to exclude filenames
   * @returns Array of matching file paths
   */
  list: (options?: {
    recursive?: boolean;
    match?: RegExp;
    exclude?: RegExp;
  }) => string[];
  /**
   * Checks if file exists
   * @returns True if file exists, false otherwise
   */
  exists: () => boolean;
  /**
   * Creates a directory
   * @param options Directory creation options
   */
  createDir: (options?: Deno.MkdirOptions) => Promise<void>;
  /**
   * Synchronously creates a directory
   * @param options Directory creation options
   */
  createDirSync: (options?: Deno.MkdirOptions) => void;
  /**
   * Reads file contents
   * @param options File read options
   * @returns Promise resolving to file contents as string
   */
  read: (options?: Deno.ReadFileOptions) => Promise<string>;
  /**
   * Synchronously reads file contents
   * @returns File contents as string
   */
  readSync: () => string;
  /**
   * Reads and parses JSON file contents
   * @param options File read options
   * @returns Promise resolving to parsed JSON data
   */
  readJson: <T = unknown>(options?: Deno.ReadFileOptions) => Promise<T>;
  /**
   * Synchronously reads and parses JSON file contents
   * @returns Parsed JSON data
   */
  readJsonSync: <T = unknown>() => T;
  /**
   * Writes string data to file
   * @param data String data to write
   * @param options File write options
   */
  write: (data: string, options?: Deno.WriteFileOptions) => Promise<void>;
  /**
   * Synchronously writes string data to file
   * @param data String data to write
   * @param options File write options
   */
  writeSync: (data: string, options?: Deno.WriteFileOptions) => void;
  /**
   * Stringifies and writes JSON data to file
   * @param data Data to stringify and write
   * @param options File write options
   */
  writeJson: (data: unknown, options?: Deno.WriteFileOptions) => Promise<void>;
  /**
   * Synchronously stringifies and writes JSON data to file
   * @param data Data to stringify and write
   * @param options File write options
   */
  writeJsonSync: (data: unknown, options?: Deno.WriteFileOptions) => void;
}
