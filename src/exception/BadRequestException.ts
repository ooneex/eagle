import { STATUS_CODE } from '../http/status';
import { Exception } from './Exception';

export class BadRequestException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.BadRequest, data);
  }
}
