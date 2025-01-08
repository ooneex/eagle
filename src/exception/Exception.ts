import type { ExceptionStackType } from './types.ts';

export class Exception<T = unknown> extends Error {
  public readonly stacks: ExceptionStackType[] = [];
  public readonly file: string | null = null;
  public readonly line: number | null = null;
  public readonly column: number | null = null;
  public readonly date: Date = new Date();
  public readonly status: number | null = null;
  public readonly data: Readonly<Record<string, T>> | null = null;

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
