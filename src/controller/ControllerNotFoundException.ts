import { Exception } from '@/exception/Exception.ts';
import { STATUS_CODE } from '@/http/status.ts';

export class ControllerNotFoundException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.NotFound, data);
  }
}
