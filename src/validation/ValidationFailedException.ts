import { Exception } from '../exception/Exception';
import { STATUS_CODE } from '../http/status';

export class ValidationFailedException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.BadRequest, data);
  }
}
