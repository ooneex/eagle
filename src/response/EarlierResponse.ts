import type { IResponse } from './types';

export class EarlierResponse extends Error {
  constructor(
    public readonly message: string,
    public readonly response: IResponse,
  ) {
    super(message);
  }
}
