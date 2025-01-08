import type { ExceptionStackType } from './types.ts';

/**
 * Custom Exception class that extends the native Error class with additional properties.
 *
 * @template T Type for additional data payload
 *
 * @property {ExceptionStackType[]} stacks - Array of error stack trace entries
 * @property {string | null} file - File where the error occurred
 * @property {number | null} line - Line number where the error occurred
 * @property {number | null} column - Column number where the error occurred
 * @property {Date} date - Timestamp when the error was created
 * @property {number | null} status - HTTP status code or custom error code
 * @property {Readonly<Record<string, T>> | null} data - Additional data payload
 */
export class Exception<T = unknown> extends Error {
  public readonly stacks: ExceptionStackType[] = [];
  public readonly file: string | null = null;
  public readonly line: number | null = null;
  public readonly column: number | null = null;
  public readonly date: Date = new Date();
  public readonly status: number | null = null;
  public readonly data: Readonly<Record<string, T>> | null = null;

  /**
   * Creates a new Exception instance.
   *
   * @param {string | Error} message - Error message or Error instance
   * @param {number | null} status - HTTP status code or custom error code
   * @param {Readonly<Record<string, T>> | null} data - Additional data payload
   */
  constructor(
    message: string | Error,
    status: number | null = null,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message instanceof Error ? (message as Error).message : message);
    this.stacks = this.parseStack(
      message instanceof Error
        ? (message.stack as string)
        : (this.stack as string),
    );

    if (0 < this.stacks.length) {
      const stack =
        this.stacks[
          message instanceof Error ? 0 : 2 < this.stacks.length ? 2 : 0
        ];
      this.file = stack.file;
      this.line = stack.line;
      this.column = stack.column;
    }

    this.status = status;
    this.data = data;
  }

  /**
   * Parses an error stack trace string into structured stack trace entries.
   *
   * @param {string} stack - Raw error stack trace string
   * @returns {ExceptionStackType[]} Array of parsed stack trace entries
   * @private
   */
  private parseStack(stack: string): ExceptionStackType[] {
    const errorStack: ExceptionStackType[] = [];
    const stacks = stack.split(/[\n\r]/) ?? [];

    stacks.map((stack) => {
      const match = stack
        .trim()
        .match(/at (?<match>.+:(?<file>\d+):(?<stack>\d+)\)?)/i);
      if (match) {
        const file = match[1];
        errorStack.push({
          file: file.replace(`:${match[2]}:${match[3]}`, ''),
          line: Number.parseInt(match[2]),
          column: Number.parseInt(match[3]),
        });
      }

      return stack;
    });

    return errorStack;
  }
}
