import { Exception } from '@/exception/Exception.ts';

export class ControllerActionException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, 500, data);
  }
}