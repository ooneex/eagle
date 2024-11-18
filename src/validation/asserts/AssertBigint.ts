import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertBigint implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'bigint',
      message: 'value must be a bigint',
    };
  }
}
