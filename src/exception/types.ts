/**
 * Represents the structure of an exception stack trace entry
 * @typedef {Object} ExceptionStackType
 * @property {string} file - The file path where the exception occurred
 * @property {number} line - The line number in the file where the exception occurred
 * @property {number} column - The column number in the file where the exception occurred
 */
export type ExceptionStackType = {
  file: string;
  line: number;
  column: number;
};
