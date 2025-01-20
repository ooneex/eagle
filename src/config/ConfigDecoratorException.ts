import { STATUS_CODE } from '@std/http/status';
import { Exception } from '../exception/Exception';

export class ConfigDecoratorException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.InternalServerError, data);
  }
}
