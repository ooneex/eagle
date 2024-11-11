export interface IFile {
  list: (options?: {
    recursive?: boolean;
    match?: RegExp;
    exclude?: RegExp;
  }) => string[];
}
