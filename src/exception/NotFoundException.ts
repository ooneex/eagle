import { Exception } from './Exception.ts';

export class NotFoundException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, 404, data);
  }
}
